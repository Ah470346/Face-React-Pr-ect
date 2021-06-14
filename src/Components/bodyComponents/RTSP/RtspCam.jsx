import React, {useState  ,useRef} from 'react';
import { Button ,Spin,notification} from 'antd';
import {useSelector,useDispatch} from 'react-redux';
import {fetchFaceDetect,addRecognition,changeRecognition,deleteRecognition} from '../../../Actions/actionCreators';
import {handlePlay} from './Recognition-rtsp';
import JSMpeg from '@cycjimmy/jsmpeg-player';
import Play from '../../../assets/play-button.svg';
import Profile from '../../../assets/bussiness-man.svg';
import CheckNetwork from '../.././CheckNetwork';

    
function RtspCam(props) {
    const dispatch = useDispatch();
    const changeList = (rec) => dispatch(changeRecognition(rec));
    const addList = (rec) => dispatch(addRecognition(rec));
    const deleteItem = (label) => dispatch(deleteRecognition(label));
    const fetchFaceDetects = () => dispatch(fetchFaceDetect());

    const [openCamVideo, setOpenCamVideo] = useState(false);
    const [recognition, setRecognition] = useState(false);
    const [videoOpacity, setVideoOpacity] = useState("0");
    // const [mediaStream, setMediaStream] = useState("");
    const [Jsmpeg, setJsmpeg] = useState("");
    const elVideo = useRef();
    const faceDescriptions = useSelector(state => state.faceDetect);
    const listItem = useSelector(state => state.listRecognition);
    const addCanvasStream = () =>{
        const wrap  = document.getElementById('wrap-canvas');
        const Canvas  = document.createElement('canvas');
        Canvas.setAttribute('id',"canvas");
        wrap.appendChild(Canvas);
        var videoUrl = 'ws://localhost:9999';
        const jsmpeg =  new JSMpeg.VideoElement( wrap,videoUrl,{canvas:Canvas});
        setJsmpeg(jsmpeg);
        const mediaStream = Canvas.captureStream();
        return mediaStream;
    }

    const streamCamVideo = (video) => {
        if(CheckNetwork()===false){
            notification.error({
                message: 'Yêu cầu kết nối mạng !!!',
                description:
                  'Thiết bị của bạn chưa kết nối mạng',
            });
        } else{
            setOpenCamVideo(true);
            setRecognition(true);
            fetchFaceDetects();
            setTimeout( async()=>{
                setVideoOpacity("1");
                setOpenCamVideo(false);
            },2000);
            const mediaStream = addCanvasStream(); 
                video.current.srcObject = mediaStream;
                video.current.onloadedmetadata = function(e) {
                    video.current.play();
                };
        }
    }
       
    const stop = (video) => {
        fetchFaceDetects();
        setVideoOpacity("0");
        Jsmpeg.destroy();
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
    return (
        <div className="wrap-body rtsp">
            <div className='wrap-recognition rtsp'>
                <div className='wrap-button'>
                    {recognition === false
                    ? (<Button onClick={()=> streamCamVideo(elVideo)} type='primary' danger>Start RTSP Camera</Button>)
                    : (<Button onClick={()=> stop(elVideo)} type='primary' danger>Stop Camera</Button>)
                    }   
                </div>
                <div id="wrap-video" className='wrap-video' >
                    <Spin spinning={openCamVideo}>
                        <div id="wrap-canvas" className="wrap-canvas">
                        </div>
                        <video 
                            style={{opacity:videoOpacity}}
                            playsInline autoPlay muted 
                            type='video/mp4' width="720" height="560" id="video" 
                            onPlay={()=>{handlePlay(faceDescriptions,addList,changeList,deleteItem)}} 
                            ref={elVideo}></video>
                        {recognition === false && <div className="wrap-play">
                            <img src={Play} alt="" />
                        </div>}
                    </Spin>
                </div>
            </div>
            <div className='list-recognition'>
                <p className='title'>Danh Sách Nhận Diện</p>
                <div className="list-item">
                    {
                        listItem.map((i,index)=>{
                            return(
                                <div className="item" key={index}>
                                    <div className="wrap-label">
                                        <img width="35" height="35" src={Profile} alt="" />
                                        <p>{i.label}</p>
                                    </div>
                                    <p>{i.time}</p>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}


export default RtspCam;

