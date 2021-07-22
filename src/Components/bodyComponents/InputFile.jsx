import React , {useState} from 'react';
import {notification,Tooltip,Spin,Progress,Modal,Select} from 'antd';
import {useSelector,useDispatch} from 'react-redux';
import {fetchFaceDetect} from '../../Actions/actionCreators';
import {handleTrainImages} from "./Training";
import shortID from 'shortid';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faFolderPlus} from '@fortawesome/free-solid-svg-icons';
import recognitionApi from '../../api/recognitionApi';
import ListRetrain from './listRetrain';
import * as faceapi from 'face-api.js';
import CheckNetwork from "../CheckNetwork";
import {getTime} from "./RTSP/Recognition-rtsp";
import axios from 'axios';

const { Option } = Select;

function InputFile({setReload,reload,setInfo,setShow}) {
    const dispatch = useDispatch();
    const fetchFaceDetects = () => dispatch(fetchFaceDetect());

    //modal visible
    const [visible, setVisible] = useState(false);
    
    const [spin, setSpin] = useState(false);
    const [progress, setProgress] = useState(false);
    const [percent, setPercent] = useState({number:1});
    const [folderName, setFolderName] = useState("");
    const [dataUpLoad , setDataUpLoad] = useState([]);
    const [dataTrain , setDataTrain] = useState([]);
    const [channel , setChannel] = useState("");

    const faceDescriptions = useSelector(state => state.faceDetect);
    const channels = useSelector(state => state.channel);
    //---------------------------------show modal retrain
    const [dataExist , setDataExist] = useState([]);
    const [dataNew , setDataNew] = useState([]);

    function handleChange(value) {
        setChannel(value);
        setVisible(false);
    }

    const checkRetrain = (data) => {
        let arry1 =[];
        let arry2 =[];
        const faceDetect = faceDescriptions.filter((i)=>{
            return i.ChannelName === channel;
        })
        //------------------------data exist
        for(let i of data){
            for(let j of faceDetect){
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
        setDataTrain([...arry1,...arry2].map((i)=> {return {...i,channel:channel}}));
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
            setVisible(false);
            setDataExist([]);
            setDataNew([]);    
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
            const arrayImage = [];
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
                setFolderName(str.slice(0,first-1));
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
                    //cho image vào mảng 
                    for(let file of filterFiles){
                        if(file.webkitRelativePath.includes(`${result1}/`)){
                            const data = new FormData();
                            data.append('file', file);
                            data.append('name', result1);
                            arrayImage.push(data);
                            break;
                        }
                    }
                    array.push(arr);
                    Labels.push(result1);
                }
                result2 = result1;
            }
            const result = Labels.map((i,index)=>{
                const a = array[index].map(async (e)=>{
                    return await getBase64(e);
                })
                return {label: i , images: a,file: arrayImage[index]};
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
            Promise.all([
                faceapi.nets.ssdMobilenetv1.load('/models')
            ]).then( async(res)=>{
                const result = [];
                const faceDetectPromise =  await handleTrainImages(data,setProgress,setPercent,percent);
                for(let i of faceDetectPromise[0]){
                    let a = await i ; 
                    let CheckedFaceDetects = [];// các ảnh đã được lọc , nếu không có khuôn mặt thì bỏ qua
                    for(let i of a.faceDetects){
                        if(i.length !==0){
                            CheckedFaceDetects.push(i);
                        }
                    }
                    result.push({faceID: shortID.generate(),label: a.label, faceDetects: CheckedFaceDetects,ChannelName:a.ChannelName,Time:getTime().datetime,Active: true, isDelete:false,bestMatch:a.bestMatch,file:a.file});
                }
                if(result.length === faceDetectPromise[0].length){
                    console.log(result);
                    //push data to server
                    for(let i = 0 ; i < result.length ; i++){
                        let array = [];
                        for(let e of result[i].faceDetects){
                            array.push(Array.from(e).map(String));
                        }
                        await recognitionApi.postRecognition({...result[i],
                            faceDetects: array})
                        result[i].file.append("ChannelName",result[i].ChannelName);
                        await axios.post("/api/recognitions/upload", result[i].file,{});
                    }
                    //set information up load
                    const info = [];
                    for(let i of result){
                        info.push({name: i.label, images: i.faceDetects.length, total: data.map((j)=>{if(i.label===j.label){return j.images.length}}),bestMatch:i.bestMatch});
                    } 
                    setInfo(info);
                    //-----------------------------------------------------
                    notification.success({
                        message: 'Train Hoàn Tất !!!',
                        description:
                            'Quá trình train hoàn tất !',
                    });
                    setReload(!reload);
                    fetchFaceDetects();
                    checkRetrain(dataUpLoad);
                    setShow(false);
                }
            })
        }
    }
    const clickUpload = (event)=>{
        if(channel ===""){
            notification.error({
                message: 'Channel not selected yet !!!',
                description:
                  'Please choose a channel to train',
            });
            event.preventDefault();
        } else{}
    }
    return (
        <>
            <Modal
            title="Add User"
            centered
            visible={true}
            okText="Train"
            onOk={()=>{
                if(progress === true){}
                else if(dataTrain.length!==0){handleTrain([...dataTrain]);setProgress(true)}
                else {
                    notification.error({
                        message: 'Folder chưa được chọn !!!',
                        description:
                          'Bạn hãy chọn một folder',
                    });
                }}}
            onCancel={()=>{if(progress === true){}else{setShow(false)}}}
            className='input-modal'
            width='1000px'
            >
                <div className="wrap-content-input-modal">
                    <div className="choose-channel">
                        <p className="p-channel">Channel</p>
                        <Select className="select" onChange={handleChange} defaultValue="Select a channel">
                            {
                                channels.map((i,index)=>{
                                    return(<Option value={i.ChannelName} key={index}>{i.ChannelName}</Option>)
                                })
                            }
                        </Select>
                    </div>
                    <div className="choose-folder">
                        <p>Folder</p>
                        <div className='wrap-input'>
                            <Spin spinning={spin}>
                            <Tooltip  placement="top" title='Note: Only received upload folder'>
                                <label  htmlFor='train'><FontAwesomeIcon className="icon" icon={faFolderPlus}></FontAwesomeIcon>Select a folders</label>
                            </Tooltip>
                            </Spin>
                            <input onClick={clickUpload} onChange={handleUpLoad} id="train" type='file' directory="" webkitdirectory=""></input>
                            {visible === true && <p>{folderName}</p>}
                        </div>
                    </div>
                </div>
                <ListRetrain 
                dataExist={dataExist} handleTrain={handleTrain}  setDataTrain={setDataTrain}
                dataNew={dataNew} setVisible={setVisible} visible={visible} dataTrain={dataTrain}></ListRetrain>
                {progress === true && <div className="progress">
                    <Progress percent={percent.number} />
                </div>}
            </Modal>
        </>
    )
}


export default InputFile;

