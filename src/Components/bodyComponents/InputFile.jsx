import React , {useState} from 'react';
import {notification,Tooltip,Spin} from 'antd';
import {useSelector,useDispatch} from 'react-redux';
import {fetchFaceDetect} from '../../Actions/actionCreators';
import {useHistory} from 'react-router-dom';
import {handleTrainImages} from "./Training";
import shortID from 'shortid';
import recognitionApi from '../../api/recognitionApi';
import ListRetrain from './listRetrain';
import * as faceapi from 'face-api.js';
import CheckNetwork from "../CheckNetwork";


function InputFile({setReload,reload,setReplay,setInfo,onClick}) {
    const dispatch = useDispatch();
    const fetchFaceDetects = () => dispatch(fetchFaceDetect());

    //modal visible
    const [visible, setVisible] = useState(false);
    
    const [trainLoading, setTrainLoading] = useState("Choose folder to train");
    const [spin, setSpin] = useState(false);
    const [dataUpLoad , setDataUpLoad] = useState([]);


    const history = useHistory();
    const faceDescriptions = useSelector(state => state.faceDetect);
    const status = useSelector(state => state.status);
    //---------------------------------show modal retrain
    const [dataExist , setDataExist] = useState([]);
    const [dataNew , setDataNew] = useState([]);
    

    const checkRetrain = (data) => {
        let arry1 =[];
        let arry2 =[];
        //------------------------data exist
        for(let i of data){
            for(let j of faceDescriptions){
                if(i.label === j.label){
                    arry1.push(i);
                }
            }
        }
        //--------------------------data new
        for(let i of data){
            let check = true;
            for(let j of arry1){
                if(i.label === j.label){
                    check = false
                }
            }
            if(check === true){
                arry2.push(i);
            }
            
        }
        setDataExist(arry1);
        setDataNew(arry2);
    }
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
        if(CheckNetwork()===false){
            notification.error({
                message: 'Yêu cầu kết nối mạng !!!',
                description:
                  'Thiết bị của bạn chưa kết nối mạng',
            });
        } else{
            onClick();
            fetchFaceDetects();
            setSpin(true);
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
                        //-----------------------------------------Đây là chỗ cho file vào mảng (dễ sai)
                        return file.webkitRelativePath.includes(`${result1}/`);
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
            //-------------------------
            setSpin(true);
            setDataUpLoad(result);
            checkRetrain(result);
            setTimeout(()=>{
                setSpin(false);
                setVisible(true);
                event.target.value = null;
            },1500)
        }
    }
    //----------------------------------call train images when download face-api and set dataDetects
    const handleTrain = (data) =>{
        if(CheckNetwork()===false){
            notification.error({
                message: 'Yêu cầu kết nối mạng !!!',
                description:
                  'Thiết bị của bạn chưa kết nối mạng',
            });
        } else{
            if(data.length === 0){
                notification.error({
                    message: 'Chưa chọn folder training !!!',
                });
            } else {
            setSpin(true);
            setTrainLoading("Training....");
            Promise.all([
                faceapi.nets.ssdMobilenetv1.load('/models')
            ]).then( async(res)=>{
                const result = [];
                const faceDetectPromise =  await handleTrainImages(data);
                console.log(faceDetectPromise);
                for(let i of faceDetectPromise[0]){
                    let a = await i ; 
                    let CheckedFaceDetects = [];// các ảnh đã được lọc , nếu không có khuôn mặt thì bỏ qua
                    for(let i of a.faceDetects){
                        if(i.length !==0){
                            CheckedFaceDetects.push(i);
                        }
                    }
                    result.push({faceID: shortID.generate(),label: a.label, faceDetects: CheckedFaceDetects});
                }
                if(result.length === faceDetectPromise[0].length){
                //push data to server
                    for(let i = 0 ; i < result.length ; i++){
                        let array = [];
                        for(let e of result[i].faceDetects){
                            array.push(Array.from(e).map(String));
                        }
                        await recognitionApi.postRecognition({...result[i],
                            faceDetects: array})
                    }
                    //set information up load
                    const info = [];
                    for(let i of result){
                        info.push({name: i.label, images: i.faceDetects.length, total: data.map((j)=>{if(i.label===j.label){return j.images.length}})});
                    } 
                    setInfo(info);
                    //-----------------------------------------------------
                    setSpin(false);
                    notification.success({
                        message: 'Train Hoàn Tất !!!',
                        description:
                            'Quá trình train hoàn tất !',
                    });
                    setTrainLoading('Choose folder to train');
                    setReload(!reload);
                    setReplay(true);
                    fetchFaceDetects();
                    checkRetrain(dataUpLoad);
                }
            })
            }
        }
    }
    return (
        <>
            {dataNew.length === 1 && dataExist.length === 0 ? <></>:<ListRetrain 
                dataExist={dataExist} handleTrain={handleTrain}  
                dataNew={dataNew} setVisible={setVisible} visible={visible} ></ListRetrain>}
            <div className='wrap-input'>
                <Spin spinning={spin}>
                    <Tooltip  placement="top" title='Lưu ý: Chỉ nhận upload folder và '>
                        <label htmlFor='train'>{trainLoading}</label>
                    </Tooltip>
                    <input onChange={handleUpLoad} id="train" type='file' directory="" webkitdirectory=""></input>
                </Spin>
            </div>
        </>
    )
}


export default InputFile;

