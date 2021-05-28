import React, {useState  ,useRef,useEffect} from 'react';
import { Button ,notification} from 'antd';
import * as canvas from 'canvas';
// import '@tensorflow/tfjs-node';
import {useSelector,useDispatch} from 'react-redux';
import {fetchFaceDetect} from '../../Actions/actionCreators';
import * as faceapi from 'face-api.js';
import InputFile from './InputFile';
import TrainStatus from './trainStatus';
import ListTrain from './listTrain';


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
    // const [loadModels, setLoadModels] = useState(false);
    const [openCamVideo, setOpenCamVideo] = useState(false);
    const [recognition, setRecognition] = useState(false);
    const [reload,setReload] = useState(false);
    const [replay,setReplay] = useState(false);
    const [showModal,setShowModal] = useState(false);
    const [info,setInfo] = useState([]);
    const elVideo = useRef();
    const faceDescriptions = useSelector(state => state.faceDetect);
    console.log(faceDescriptions);
    const labeledDescriptors = (descriptions) => {
        return descriptions.map((description)=>{
            let face = new faceapi.LabeledFaceDescriptors(description.label, description.faceDetects);
            return face;
        });
    }

    const handlePlay = (vd) =>{
        const video = document.getElementById('video');
        const wrapVideo = document.getElementById('wrap-video');
        const CurrentCanvas = document.getElementsByTagName('canvas');
        const canvas = faceapi.createCanvasFromMedia(video);
        if(CurrentCanvas.length !== 0){
            wrapVideo.replaceChild(canvas,CurrentCanvas[0]);
        } else{
            wrapVideo.appendChild(canvas);
        }
        
        

        let faceMatcher = [];
        if(faceDescriptions.length !== 0){
            faceMatcher = new faceapi.FaceMatcher(labeledDescriptors(faceDescriptions),0.5);
        }

        const displaySize = {width: vd.current.offsetWidth,height: vd.current.offsetHeight };
        faceapi.matchDimensions(canvas,displaySize);
        setInterval(async()=>{
            
            const detections = await faceapi.detectAllFaces(video,
                new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks().withFaceDescriptors();
            const resizeDetections = faceapi.resizeResults(detections,displaySize);

            // draw canvas by boxResize
            // const boxResize = (resizeDetections)=>{
            //     if(resizeDetections[0] === undefined){
            //         return [];
            //     } else {
            //         console.log(resizeDetections[0].alignedRect._box);
            //         return resizeDetections[0].alignedRect._box;
            //     }
            // }
            canvas.getContext('2d').clearRect(0,0, canvas.width,canvas.height);
            if(faceMatcher.length === 0){
                faceapi.draw.drawDetections(canvas,resizeDetections);
            } else if(faceMatcher.length !== 0){
                const results = resizeDetections.map(d => faceMatcher.findBestMatch(d.descriptor));
                canvas.getContext('2d').clearRect(0,0, canvas.width,canvas.height);
                results.forEach((r,i)=>{
                    const box = resizeDetections[i].detection.box;
                    const drawBox = new faceapi.draw.DrawBox(box,{label: r.toString()});
                    drawBox.draw(canvas);
                })
            }
        },200);

    }
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


    useEffect(()=>{
        const loadModal = ()=>{
            if(info.length !== 0){
                setShowModal(true);
            }
        }
        loadModal();
    },[reload]);
    return (
        // <Spin style={{height:'100%'}} spinning={loadModels} className='spin-body' tip='Loading models...'>
        <div className="wrap-body">
            <div className={'wrap-list-train'}>
                <ListTrain></ListTrain>
            </div>
            <div className='wrap-recognition'>
                <div className='wrap-button'>
                    <InputFile setReplay={setReplay} setReload={setReload} reload={reload} setInfo={setInfo}></InputFile>
                    {recognition === false
                    ? (<Button onClick={()=> streamCamVideo(elVideo)} type='primary' danger>Face Recognition</Button>)
                    : (<Button onClick={()=> stop(elVideo)} type='primary' danger>Stop WebCam</Button>)
                    }   
                </div>
                <div id="wrap-video" className='wrap-video' >
                    { openCamVideo === true ? (
                    <>
                        <video width="720" height="560" id="video" onPlay={()=>{handlePlay(elVideo)}} ref={elVideo}></video>
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
        // </Spin>
    )
}


export default Body;

