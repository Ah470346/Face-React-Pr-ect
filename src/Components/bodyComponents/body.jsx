import React, {useState ,useEffect ,useRef} from 'react';
import { Button ,notification,Tooltip,Spin} from 'antd';
// import '@tensorflow/tfjs';
import * as canvas from 'canvas';

import * as faceapi from 'face-api.js';

import anh from '../../assets/images/08.jpg';


const { Canvas, Image, ImageData } = canvas
faceapi.env.monkeyPatch ({
    Canvas: Canvas,
    Image: Image,
    ImageData: ImageData,
    Video: HTMLVideoElement,
    createCanvasElement: () => document.createElement ('canvas'),
    createImageElement: () => document.createElement ('img')
    })

    
function Body(props) {
    const [openCamVideo, setOpenCamVideo] = useState(false);
    const [recognition, setRecognition] = useState(false);
    const [train, setTrain] = useState(false);
    const [success, setSuccess] = useState("");
    const [trainLoading, setTrainLoading] = useState("Train");
    const [spin, setSpin] = useState(true);
    const [dataUpLoad , setDataUpLoad] = useState([]);
    const elVideo = useRef();
    function getBase64(file) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
    }
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
        setDataUpLoad(result);
        setTimeout(()=>{
            setSpin(false);
            setSuccess("Folder was ready");
        },1500)
    }

    const handlePlay = () =>{
        console.log("hello");
    }
    const handleTrainImages = () =>{
        return Promise.all([
            dataUpLoad.map(async label =>{
                const descriptions = [];
                for(let i of label.images){
                    const img = await i;
                    const a = document.createElement('img');
                    a.src = img;
                    const detections = await faceapi.detectSingleFace(a).withFaceLandmarks().withFaceDescriptor();
                    if(detections.descriptor){
                        descriptions.push(detections.descriptor);
                    }   
                }
                console.log(descriptions);
                return descriptions;
            })
        ]);
    }

    const handleTrain = ()=>{
        setTrainLoading("Training....");
        setSuccess("");
        setSpin(true);
        Promise.all([
            faceapi.nets.faceLandmark68Net.load('/models'),
            faceapi.nets.ssdMobilenetv1.load('/models'),
            faceapi.nets.tinyFaceDetector.load('/models'),
            faceapi.nets.faceRecognitionNet.load('/models'),
            faceapi.nets.faceExpressionNet.load('/models'),
        ]).then(() => {
            const a =  handleTrainImages();
            if(a !== undefined){
                setSpin(false);
                notification.success({
                    message: 'Train thành công !!!',
                    description:
                      'Qúa trình train hoàn tất',
                });
                setTrain(false);
            }
        });
    }

    const streamCamVideo = (video) => {
        const constraints = {audio: false , video : true};
        navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function(mediaStream) {
            setOpenCamVideo(true);
            setRecognition(true);
            video.current.srcObject = mediaStream;
            video.current.onloadedmetadata = function(e) {
                video.current.play();
            };
          })
          .catch(function(err) {
            console.log(err.name + ": " + err.message);
            if(err.name === "NotFoundError"){
                notification.error({
                    message: 'Không tìm thấy thiết bị !!!',
                    description:
                      'Máy tính của bạn có thể không hỗ trợ webCam, chúng tôi không tìm thấy thiết bị',
                });
            } else if(err.name === "NotAllowedError"){
                notification.error({
                    message: 'Không được cấp phép truy cập !!!',
                    description:
                      'Hãy cấp phép cho website truy cập vào thiết bị của bạn!',
                });
            }
            
          }); // always check for errors at the end.
    }
    const stop = (video) => {
        const stream = video.current.srcObject;
        const tracks = stream.getTracks();

        tracks.forEach(function(track) {
            track.stop();
        });

        video.current.srcObject = null;
        
        setOpenCamVideo(false);
        setRecognition(false);
    }

    const faceDetect = async () => {
            console.log('hello');
    }
    useEffect(()=>{
        // Promise.all([
        //     faceapi.nets.faceLandmark68Net.load('/models'),
        //     faceapi.nets.ssdMobilenetv1.load('/models'),
        //     faceapi.nets.tinyFaceDetector.load('/models'),
        //     faceapi.nets.faceRecognitionNet.load('/models'),
        //     faceapi.nets.faceExpressionNet.load('/models'),
        // ]).then();
    },[])
    return (
        <div className="wrap-body">
            <div className='wrap-recognition container'>
                <div className='wrap-button'>
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
                    {recognition === false
                    ? (<Button onClick={()=> streamCamVideo(elVideo)} type='primary' danger>Face Recognition</Button>)
                    : (<Button onClick={()=> stop(elVideo)} type='primary' danger>Stop WebCam</Button>)
                    }   
                </div>
                <div className='wrap-video'>
                    { openCamVideo === true ? (<video onPlay={handlePlay} ref={elVideo}></video>)
                    :
                    (<div className='signal'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="currentColor" className="bi bi-play-circle" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                            <path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445z"/>
                        </svg>
                        <p>No Signal</p>
                    </div>)}
                </div>
            </div>
        </div>
    )
}


export default Body;

