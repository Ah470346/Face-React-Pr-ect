import React, {useState  ,useRef,useEffect} from 'react';
import { Button ,notification} from 'antd';
import * as canvas from 'canvas';
import {useSelector,useDispatch} from 'react-redux';
import {fetchFaceDetect} from '../../Actions/actionCreators';
import * as faceapi from 'face-api.js';
import InputFile from './InputFile';
import TrainStatus from './trainStatus';
import ListTrain from './listTrain';
import {handlePlay} from './Recognition';

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
    const dispatch = useDispatch();
    const fetchFaceDetects = () => dispatch(fetchFaceDetect());
    // spin load models
    const [openCamVideo, setOpenCamVideo] = useState(false);
    const [recognition, setRecognition] = useState(false);
    const [reload,setReload] = useState(false);
    const [replay,setReplay] = useState(false);
    const [showModal,setShowModal] = useState(false);
    const [info,setInfo] = useState([]);
    const [metadata,setMetadata] = useState("");
    const elVideo = useRef();
    const faceDescriptions = useSelector(state => state.faceDetect);
    const permission = useSelector(state => state.permission);
    console.log(faceDescriptions);

    // replay canvas when update train
    if(faceDescriptions!== undefined && faceDescriptions.length!==0 && replay ===true){
        const CurrentVideo = document.getElementsByTagName('video');
        if(CurrentVideo.length !== 0){
            handlePlay(elVideo);
        }
        setReplay(false); 
    }

    const streamCamVideo = (video) => {
        fetchFaceDetects();
        const constraints = {audio : false,video : true};
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
        if(video.current !==undefined && video.current !== null){
            const stream = video.current.srcObject;
            if(stream !== null){
                const tracks = stream.getTracks();
                const canvas = document.getElementsByTagName('canvas');
                const wrapVideo = document.getElementById('wrap-video');
                wrapVideo.removeChild(canvas[0])
                tracks.forEach(function(track) {
                    track.stop();
                });

                video.current.srcObject = null;
                
                setOpenCamVideo(false);
                setRecognition(false);
            }
        }
        
    }
    useEffect(()=>{
        const loadModal = ()=>{
            if(info.length !== 0){
                setShowModal(true);
            }
        }
        loadModal();
    },[reload]);
    return (
        <div className="wrap-body">
            <div className="side-bar">
                <div className='wrap-list-train'>
                    <ListTrain></ListTrain>
                </div>
            </div>
            <div className='wrap-recognition'>
                <div className='wrap-button'>
                    {permission.permission === "admin" && <InputFile onClick={()=>stop(elVideo)} setReplay={setReplay} setReload={setReload} reload={reload} setInfo={setInfo}></InputFile>}
                    {recognition === false
                    ? (<Button onClick={()=> streamCamVideo(elVideo)} type='primary' danger>Face Recognition</Button>)
                    : (<Button onClick={()=> stop(elVideo)} type='primary' danger>Stop WebCam</Button>)
                    }   
                </div>
                <div id="wrap-video" className='wrap-video' >
                    { openCamVideo === true ? (
                    <>
                        <video 
                            playsInline autoPlay muted 
                            type='video/mp4' width="720" height="560" id="video" 
                            onPlay={()=>{handlePlay(elVideo,faceDescriptions,metadata.videoWidth,metadata.videoHeight)}} 
                            ref={elVideo} onLoadedMetadata={e => {
                                setMetadata({
                                  videoHeight: e.target.videoHeight,
                                  videoWidth: e.target.videoWidth,
                                  duration: e.target.duration
                                });
                              }}></video>
                    </>
                    )
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
            {showModal === true && <TrainStatus info={info} setInfo={setInfo} faceDetect={faceDescriptions} setShowModal={setShowModal}></TrainStatus>}
        </div>
    )
}


export default Body;

