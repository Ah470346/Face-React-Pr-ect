import React, {useState ,useEffect ,useRef} from 'react';
import { Button ,notification} from 'antd';
import '@tensorflow/tfjs';
import * as canvas from 'canvas';

import * as faceapi from 'face-api.js';

const { Canvas, Image, ImageData } = canvas
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });


function Body(props) {
    const [openCamVideo, setOpenCamVideo] = useState(false);
    const [recognition, setRecognition] = useState(false);
    const elVideo = useRef();
    const handleUpLoad = (event) => {
        const files = Object.values(event.target.files);
        const array = [];
        const labels = [];
        let first , last, dem = 0 , result1, result2 = ""; 
        for(let i = 0 ; i < files.length ; i++ ){
            let str = files[i].webkitRelativePath;
            for(let i1 = 0 ; i1 < str.length ; i1++){
                if(str.charAt(i1)==='/' && dem === 0){
                    first = i1 +1; 
                    dem++;
                } else if(dem === 1 && str.charAt(i1)==='/'){
                    last = i1;
                    dem++;
                }
            }
            if(dem === 1){
                result1 = str.slice(0,last-1);
            } else if(dem===2) {
                result1 = str.slice(first,last);
            }
            dem = 0;
            if(result1 !== result2){
                const arr = files.filter((file)=>{
                    return file.webkitRelativePath.includes(result1);
                })
                array.push(arr);
                labels.push(result1);
            }
            result2 = result1;
        }
        const result = labels.map((i,index)=>{
            return {label: i , images: array[index]};
        })

        console.log(result);
        
    }
    const streamCamVideo = (video) => {
        const constraints = {audio: false , video : true};
        navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function(mediaStream) {
            video.current.srcObject = mediaStream;
            video.current.onloadedmetadata = function(e) {
                video.current.play();
            };
            setOpenCamVideo(true);
            setRecognition(true);
          })
          .catch(function(err) {
            console.log(err.name + ": " + err.message);
            if(err.name === "NotFoundError"){
                notification.error({
                    message: 'Không tìm thấy thiết bị !!!',
                    description:
                      'Máy tính của bạn có thể không hỗ trợ webCam, chúng tôi không tìm thấy thiết bị',
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
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
        await faceapi.nets.faceExpressionNet.loadFromUri('/models');
    }
    useEffect(()=>{
        faceDetect();
    },[])
    return (
        <div className="wrap-body">
            <div className='wrap-recognition container'>
                <div className='wrap-button'>
                    <div className='wrap-input'>
                        <label htmlFor='train'>Choose folder to train</label>
                        <input onChange={handleUpLoad} id="train" type='file' directory="" webkitdirectory=""></input>
                        <p>No folder was choice</p>
                    </div>
                    {recognition === false
                    ? (<Button onClick={()=> streamCamVideo(elVideo)} type='primary' danger>Face Recognition</Button>)
                    : (<Button onClick={()=> stop(elVideo)} type='primary' danger>Stop WebCam</Button>)
                    }   
                </div>
                <div className='wrap-video'>
                    { openCamVideo === true ? (<video ref={elVideo}></video>)
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

