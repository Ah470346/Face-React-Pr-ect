import React, {useState  ,useRef} from 'react';
import { Button ,Spin,notification} from 'antd';
import {useSelector,useDispatch} from 'react-redux';
import {fetchFaceDetect} from '../../../Actions/actionCreators';
import {handlePlay} from './Recognition-rtsp';
import JSMpeg from '@cycjimmy/jsmpeg-player';
import Play from '../../../assets/play-button.svg';

    
function RtspCam(props) {
    const dispatch = useDispatch();
    const fetchFaceDetects = () => dispatch(fetchFaceDetect());

    const [openCamVideo, setOpenCamVideo] = useState(false);
    const [recognition, setRecognition] = useState(false);
    const [videoOpacity, setVideoOpacity] = useState("0");
    // const [mediaStream, setMediaStream] = useState("");
    const [Jsmpeg, setJsmpeg] = useState("");
    const [metadata,setMetadata] = useState("");
    const elVideo = useRef();
    const faceDescriptions = useSelector(state => state.faceDetect);

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
    const stop = (video) => {
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
                    ? (<Button onClick={()=> streamCamVideo(elVideo)} type='primary' danger>Start Rtsp Camera</Button>)
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
                            onPlay={()=>{handlePlay(elVideo,faceDescriptions,metadata.videoWidth,metadata.videoHeight)}} 
                            ref={elVideo} onLoadedMetadata={e => {
                                setMetadata({
                                    videoHeight: e.target.videoHeight,
                                    videoWidth: e.target.videoWidth,
                                    duration: e.target.duration
                                });
                                }}></video>
                        {recognition === false && <div className="wrap-play">
                            <img src={Play} alt="" />
                        </div>}
                    </Spin>
                </div>
            </div>
            <div className='list-recognition'>
                <p className='title'>Danh Sách Nhận Diện</p>
                <div className="list-item"></div>
            </div>
        </div>
    )
}


export default RtspCam;

