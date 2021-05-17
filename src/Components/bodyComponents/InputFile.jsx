import React , {useState,useRef} from 'react';
import { Button ,notification,Tooltip,Spin} from 'antd';
import * as faceapi from 'face-api.js';


function InputFile({setDataTrain,dataTrain}) {
    const [train, setTrain] = useState(false);
    const [success, setSuccess] = useState("");
    const [trainLoading, setTrainLoading] = useState("Train");
    const [spin, setSpin] = useState(true);
    const [dataUpLoad , setDataUpLoad] = useState([]);
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
        const files = Object.values(event.target.files);
        if(files.length >= 100){
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
        const array = [];
        const Labels = [];
        let first , last, dem = 0 , result1, result2 = ""; 
        for(let i = 0 ; i < files.length ; i++ ){
            let str = files[i].webkitRelativePath;
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
                const arr = files.filter((file)=>{
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
        setTrain(true);
        setSpin(true);
        setDataUpLoad(result);
        setTimeout(()=>{
            setSpin(false);
            setSuccess("Folder was ready");
        },1500)
    }
    //----------------------------------handler train images 
    const handleTrainImages = () =>{
        return Promise.all([
            dataUpLoad.map(async label =>{
                const descriptions = [];
                for(let i of label.images){
                    const img = await i;
                    const a = document.createElement('img');
                    a.src = img;
                    const detections = await faceapi.detectSingleFace(a)
                        .withFaceLandmarks()
                        .withFaceDescriptor();
                    if(detections.descriptor){
                        descriptions.push(detections.descriptor);
                    }   
                }
                return {label: label.label , faceDetects: descriptions};
            })
        ]);
    }
    //----------------------------------call train images when download face-api and set dataDetects
    const handleTrain = () =>{
        setSpin(true);
        setTrainLoading("Training....");
        setSuccess("");
        Promise.all([
            faceapi.nets.faceLandmark68Net.load('/models'),
            faceapi.nets.ssdMobilenetv1.load('/models'),
            faceapi.nets.faceRecognitionNet.load('/models'),
        ]).then(async ()=>{
            const result = [];
            const faceDetectPromise =  await handleTrainImages();
            for(let i of faceDetectPromise[0]){
                let a = await i ; 
                result.push({label: a.label, faceDetects: a.faceDetects});
            }
            if(result.length === faceDetectPromise[0].length){
                setSpin(false);
                notification.success({
                    message: 'Train thành công !!!',
                    description:
                        'Quá trình train hoàn tất !',
                });
                setTrain(false);
                setTrainLoading('Train');
                setDataTrain(result);
            }
        }).catch((err)=>{
            notification.error({
                message: 'Các gói nhận diên chưa được tải !!!',
                description:
                  `Xin kiểm tra lại kết nối mạng hoặc có thể web đang trong quá 
                  trình tải các gói nhận diện, xin thử lại sau!`,
            });
            setTrain(false);
            setTrainLoading('Train');
        });
        // const handel = async ()=>{
        //     const result = [];
        //     const faceDetectPromise =  await handleTrainImages();
        //     for(let i of faceDetectPromise[0]){
        //         let a = await i ; 
        //         result.push({label: a.label, faceDetects: a.faceDetects});
        //     }
        //     if(result.length === faceDetectPromise[0].length){
        //         setSpin(false);
        //         notification.success({
        //             message: 'Train thành công !!!',
        //             description:
        //                 'Quá trình train hoàn tất !',
        //         });
        //         setTrain(false);
        //         setTrainLoading('Train');
        //         setDataTrain(result);
        //     }
        // }
        // handel();
    }
    return (
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
                        <Button onClick={handleTrain} type="primary">{trainLoading}</Button>
                    </Spin>
                        <p>{success}</p>
                </> 
            }
        </div>
    )
}


export default InputFile;

