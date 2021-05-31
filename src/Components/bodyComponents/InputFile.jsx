import React , {useState} from 'react';
import { Button ,notification,Tooltip,Spin,Modal, Checkbox } from 'antd';
import Folder from '../../assets/folder.svg';
import {useSelector,useDispatch} from 'react-redux';
import {fetchFaceDetect} from '../../Actions/actionCreators';
import {useHistory} from 'react-router-dom';
import {handleTrainImages} from "./Training";
import shortID from 'shortid';
import recognitionApi from '../../api/recognitionApi';


function InputFile({setReload,reload,setReplay,setInfo}) {
    const dispatch = useDispatch();
    const fetchFaceDetects = () => dispatch(fetchFaceDetect());

    const [train, setTrain] = useState(false);
    //modal visible
    const [visible, setVisible] = useState(false);
    const [success, setSuccess] = useState("");
    const [trainLoading, setTrainLoading] = useState("Train");
    const [spin, setSpin] = useState(true);
    const [dataUpLoad , setDataUpLoad] = useState([]);


    const history = useHistory();
    const faceDescriptions = useSelector(state => state.faceDetect);
    const status = useSelector(state => state.status);
    //---------------------------------show modal retrain
    const [dataExist , setDataExist] = useState([]);
    const hideModal = () => {
        setVisible(false);
    };
    
    const showModal = () => {
        setVisible(true);
    };

    const checkRetrain = (data) => {
        console.log(data);
        let arry =[];
        for(let i of data){
            for(let j of faceDescriptions){
                if(i.label === j.label){
                    arry.push(i);
                }
            }
        }
        setDataExist(arry);
    }
    //----------------------------------------Checkbox
    const onChange = (e) => {
        console.log('checked = ', e.target.checked);
      };
    //----------------------------------Convert image to base64
    function getBase64(file) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
    }
  //----------------------------------Check type of file 
    function Validate(data) {
        for(let i of data){
            if(i.type.includes('image')){
                return true;
            }
        }
        return false;
    }
    //----------------------------------handler when up load files 
    const handleUpLoad = (event) => {
        fetchFaceDetects();
        const files = Object.values(event.target.files);
        if(files.length >= 150){
            notification.error({
                message: 'Số lượng file quá lớn !!!',
                description:
                  'hãy tách thành các folder có số lượng files không quá 100',
            });
            setDataUpLoad([]);
            return;
        }
        if(Validate(files) === false){
            notification.error({
                message: 'File không hợp lệ !!!',
                description:
                  'File trống hoặc file có kiểu khác image, xin upload lại!',
            });
            setDataUpLoad([]);
            return;
        }
        let filterFiles =[];
        for(let i of files){
            if(i.type.includes('image')){
                filterFiles.push(i);
            }
        }
        const array = [];
        const Labels = [];
        let first , last, dem = 0 , result1, result2 = ""; 
        for(let i = 0 ; i < filterFiles.length ; i++ ){
            let str = filterFiles[i].webkitRelativePath;
            for(let i1 = 0 ; i1 < str.length ; i1++){
                if(str.charAt(i1)==='/' && dem === 0){
                    first = i1 +1; 
                    dem++;
                } else if(dem >=1 && str.charAt(i1)==='/'){
                    last = i1;
                    dem++;
                } else if (dem > 2){
                    notification.error({
                        message: 'Cấp thư mục quá cao !!!',
                        description:
                          'Chỉ nhận cấp thư mục không quá 2 (hai thư mục chồng nhau)',
                    });
                    setDataUpLoad([]);
                    return;
                }
            }
            if(dem === 1){
                result1 = str.slice(0,first-1);
            } else if(dem===2) {
                result1 = str.slice(first,last);
            }
            dem = 0;
            if(result1 !== result2){
                const arr = filterFiles.filter((file)=>{
                    return file.webkitRelativePath.includes(result1);
                })
                array.push(arr);
                Labels.push(result1);
            }
            result2 = result1;
        }
        const result = Labels.map((i,index)=>{
            const a = array[index].map(async (e)=>{
                return await getBase64(e);
            })
            return {label: i , images: a};
        })
        //set information up load
        const info = [];
        for(let i of result){
            info.push({name: i.label, images: i.images.length});
        } 
        setInfo(info);
        //-------------------------
        setTrain(true);
        setSpin(true);
        setDataUpLoad(result);
        checkRetrain(result);
        setTimeout(()=>{
            setSpin(false);
            setSuccess("Folder was ready");
        },1500)
    }
    //----------------------------------call train images when download face-api and set dataDetects
    const handleTrain = () =>{
    { 
        setSpin(true);
        setTrainLoading("Training....");
        setSuccess("");
        const handle =  async ()=>{
            const result = [];
            const faceDetectPromise =  await handleTrainImages(dataUpLoad);
            for(let i of faceDetectPromise[0]){
                let a = await i ; 
                result.push({faceID: shortID.generate(),label: a.label, faceDetects: a.faceDetects});
            }
            if(result.length === faceDetectPromise[0].length){
                // push data to server
                for(let i = 0 ; i < result.length ; i++){
                    let array = [];
                    for(let e of result[i].faceDetects){
                        array.push(Array.from(e).map(String));
                    }
                    await recognitionApi.postRecognition({...result[i],
                        faceDetects: array})
                }
                //-----------------------------------------------------
                setSpin(false);
                notification.success({
                    message: 'Train thành công !!!',
                    description:
                        'Quá trình train hoàn tất !',
                });
                setTrain(false);
                setTrainLoading('Train');
                setReload(!reload);
                setReplay(true);
                fetchFaceDetects();
                checkRetrain(dataUpLoad);
            }
        }
        handle();
    }
}
    return (
        <>
            <Modal
            title="Modal"
            centered
            visible={visible}
            onOk={()=>{hideModal();handleTrain()}}
            onCancel={hideModal}
            okText="ReTrain"
            cancelText="Cancel"
            >
            {
                dataExist.map((i,index)=>{
                    return( <div className="list-item-exist">
                        <div className="wrap-folder">
                                <img src={Folder} alt=""></img>
                                <p>{i.label}</p>
                        </div>
                        <div className='choose-folder'>
                            <Checkbox onChange={onChange}></Checkbox>
                        </div>
                    </div>
                    )
                })
            }
        </Modal>
            <div className='wrap-input'>
                {
                    train === false ?
                    <>
                    <Tooltip  placement="top" title='Chỉ nhận upload folder'>
                        <label htmlFor='train'>Choose folder to train</label>
                    </Tooltip>
                    <input onChange={handleUpLoad} id="train" type='file' directory="" webkitdirectory=""></input>
                    <p>No folder was choice</p>
                    </>
                    : <>
                        <Spin spinning={spin} className='spin'>
                            <Tooltip  placement="top" title='*Lưu ý: Tên folder chứa ảnh sẽ được lấy làm tên nhận diện khuôn mặt!'>
                                <Button 
                                    onClick={()=>{
                                        if(status.protect ==='false' ){
                                            notification.error({
                                                message: 'Yêu cầu đăng nhập trước khi trainning !!!',
                                            });
                                            history.push('/login');
                                        } else{
                                            if(dataExist.length!==0){
                                                showModal();
                                            } else{
                                                handleTrain();
                                            }
                                        }
                                        
                                    }} 
                                    type="primary">{trainLoading}</Button>
                            </Tooltip> 
                        </Spin>
                            <p>{success}</p>
                    </> 
                }
            </div>
        </>
    )
}


export default InputFile;

