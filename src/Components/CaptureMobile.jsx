import React,{useState,useRef,useEffect} from 'react';
import { Button ,notification,Spin,Select} from 'antd';
import {useSelector, useDispatch} from 'react-redux';
import * as faceapi from 'face-api.js';
import {fetchFaceDetect,saveRegister} from '../Actions/actionCreators';
import CheckNetwork from "./CheckNetwork";
import {useHistory} from 'react-router-dom';

const { Option } = Select;

export const checkScreen = (width,height,vd) =>{
    const tile = width/height;
    let w ,h ;
    // width and height  của video đều nhỏ hơn ô chứa
    if(width < vd.current.offsetWidth && height < vd.current.offsetHeight){
        h = height;
        w = width;
    }
    // width của video lớn hơn ô chứa và tỉ lệ width/height > 1
    else if(tile > 1 && width > vd.current.offsetWidth){
        h = vd.current.offsetWidth / tile;
        w = vd.current.offsetWidth;
    } 
    // height của video lớn hơn ô chứa và tỉ lệ width/height < 1
    else if(tile < 1 && height > vd.current.offsetHeight){
        const t = height/width;
        w = vd.current.offsetHeight/t;
        h = vd.current.offsetHeight;
    }
    // height của video lớn hơn ô chứa, width nhỏ hơn ô chứa và tỉ lệ width/height > 1
    else if (tile > 1 && width < vd.current.offsetWidth){
        w = vd.current.offsetHeight * tile;
        h = vd.current.offsetHeight;
    }
    // width của video lớn hơn ô chứa, height nhỏ hơn ô chứa và tỉ lệ width/height < 1
    else if (tile < 1 && height < vd.current.offsetHeight){
        w = vd.current.offsetWidth;
        h = vd.current.offsetWidth * tile;
    }
    return {width: w, height: h};
}

function CaptureMobile(props) {
    const history = useHistory();
    const [openCam,setOpenCam] = useState("1");
    const elVideo = useRef();
    const [spin,setSpin] = useState(false);
    const [metadata, setMetadata] = useState(null);
    const [size, setSize] = useState(null);
    const [faceDetectSelect, setFaceDetectSelect] = useState([]);
    const dispatch = useDispatch();
    const [saveChannel, setSaveChannel] = useState("");
    const [screenOrientation, setScreenOrientation] = useState(false);
    const fetchFaceDetects = ()=> dispatch(fetchFaceDetect);
    const faceDescriptions = useSelector(state => state.faceDetect);
    const permission = useSelector(state => state.permission);
    const channels = useSelector(state => state.channel);
    const saveRegisters = (res)=> dispatch(saveRegister(res));
    const register = useSelector((state)=> state.register);

    let canvas , ctx,video ,photo;
    video = document.getElementById("video");
    canvas = document.getElementById("canvas");
    photo = document.getElementById("image");

    window.addEventListener("orientationchange", ()=>{setScreenOrientation(!screenOrientation);}, false);
    const handleChange = (value) =>{
        const arr = faceDescriptions.filter((i)=>{
            return i.ChannelName === value;
        })
        setSaveChannel(value);
        setFaceDetectSelect(arr);
    }

    const offCam = (video)=>{
        const stream = video.current.srcObject;
        if (stream !== null){
            const tracks = stream.getTracks();
            tracks.forEach(function(track) {
                track.stop();
            });
    
            video.current.srcObject = null;
        }
    }
    const startCam = (video)=>{
        if(openCam!=="1" && openCam !== "2"){
            const constraints = {audio : false,video :
                {width: { min: 640, ideal: 1920, max: 1920 },
                height: { min: 400, ideal: 1080 },
                aspectRatio: 1.222222 }};
            navigator.mediaDevices
            .getUserMedia(constraints)
            .then(function(mediaStream) {
                video.current.srcObject = mediaStream;
                video.current.onloadedmetadata = function(e) {
                    video.current.play();
                };
            })
        }
    }

    const streamCamVideo = (video) => {
        if(CheckNetwork()===false){
            notification.error({
                message: 'Yêu cầu kết nối mạng !!!',
                description:
                  'Thiết bị của bạn chưa kết nối mạng',
            });
        } 
        else if(screenOrientation === true) {
            notification.error({
                message: 'Quay màn hình dọc để test!!!',
                description:
                  'Thiết bị của bạn đang ở chế độ màn hình ngang hãy quay dọc màn hình để test',
            });
        }else if(faceDetectSelect.length === 0){
            notification.error({
                message: 'Bạn chưa chọn channel hoặc channel không có dữ liệu !!!',
            });
        } else{
            fetchFaceDetects();
            const constraints = {audio : false,video :
                {width: { min: 640, ideal: 1920, max: 1920 },
                height: { min: 400, ideal: 1080 },
                aspectRatio: 1.222222}};
            navigator.mediaDevices
            .getUserMedia(constraints)
            .then(function(mediaStream) {
                setOpenCam("2");
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
                        "Thiết bị của bạn có thể không hỗ trợ webCam, chúng tôi không tìm thấy thiết bị",
                    });
                } else if(err.name === "NotAllowedError"){
                    notification.error({
                        message: 'Không được cấp phép truy cập !!!',
                        description:
                        'Hãy cấp phép cho website truy cập vào thiết bị của bạn!',
                    });
                }
                
            });
            // always check for errors at the end.
        }
    }
    const snapshot = (vd)=>{
        if(CheckNetwork()===false){
            notification.error({
                message: 'Yêu cầu kết nối mạng !!!',
                description:
                  'Thiết bị của bạn chưa kết nối mạng',
            });
        } else{
            fetchFaceDetects();
            const width = checkScreen(metadata.videoWidth,metadata.videoHeight,vd).width;
            const height = checkScreen(metadata.videoWidth,metadata.videoHeight,vd).height;
            canvas.setAttribute('width',width);
            canvas.setAttribute('height', height);
            ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0,0, canvas.width, canvas.height);

            setSize({width,height});
            setOpenCam("3");
            let data = canvas.toDataURL('image/png');
            photo.setAttribute('width',width);
            photo.setAttribute('height', height);
            photo.setAttribute('src', data);
            offCam(elVideo);
        }
    }
    function clearPhoto() {
        if(CheckNetwork()===false){
            notification.error({
                message: 'Yêu cầu kết nối mạng !!!',
                description:
                  'Thiết bị của bạn chưa kết nối mạng',
            });
        } else{
            fetchFaceDetects();
            if(openCam === "4"){
                startCam(elVideo);
                console.log(canvas);
                var context = canvas.getContext('2d');
                context.clearRect(0, 0, canvas.width, canvas.height);
            
                var data = canvas.toDataURL('image/png');
                photo.setAttribute('src', data);
                if(openCam === "1"){
                    setOpenCam("1");
                } else {
                    setOpenCam("2");
                }
            }
        }
      }
    // const stop = (video) => {
    //     if(CheckNetwork()===false){
    //         notification.error({
    //             message: 'Yêu cầu kết nối mạng !!!',
    //             description:
    //               'Thiết bị của bạn chưa kết nối mạng',
    //         });
    //     } else{
    //         fetchFaceDetects();
    //         const stream = video.current.srcObject;
    //         var context = canvas.getContext('2d');
    //         context.clearRect(0, 0, canvas.width, canvas.height);
    //         var data = canvas.toDataURL('image/png');
    //         photo.setAttribute('src', data);
    //         if (stream !== null){
    //             const tracks = stream.getTracks();
    //             tracks.forEach(function(track) {
    //                 track.stop();
    //             });
        
    //             video.current.srcObject = null;
    //         }
    //         setOpenCam("1");
    //     }
    // }
    //--------------------------------------------return detect
    const labeledDescriptors = (descriptions) => {
        return descriptions.map((description)=>{
            let face = new faceapi.LabeledFaceDescriptors(description.label, description.faceDetects);
            return face;
        });
    }
    const handleImage = async (width,height,faceDescriptions,image) =>{
        if(CheckNetwork()===false){
            notification.error({
                message: 'Yêu cầu kết nối mạng !!!',
                description:
                  'Thiết bị của bạn chưa kết nối mạng',
            });
        } else{
            fetchFaceDetects();
            setSpin(true);
            setTimeout(async ()=>{
                let faceMatcher = [];
                if(faceDescriptions.length !== 0){
                    faceMatcher = new faceapi.FaceMatcher(labeledDescriptors(faceDescriptions),0.40);
                }

                const displaySize = {width: width, height:height };
                faceapi.matchDimensions(canvas,displaySize);

                const detections = await faceapi.detectAllFaces(image)
                    .withFaceLandmarks().withFaceDescriptors();
                const resizeDetections = faceapi.resizeResults(detections,displaySize);

                if(faceMatcher.length === 0){
                    resizeDetections.forEach((r,i)=>{
                        const box = resizeDetections[i].detection.box;
                        const drawBox = new faceapi.draw.DrawBox(box,{label: "unknown"});
                        setSpin(false);
                        setOpenCam("4");
                        drawBox.draw(canvas);
                    })
                } else if(faceMatcher.length !== 0){
                    const results = resizeDetections.map(d => faceMatcher.findBestMatch(d.descriptor));            
                    results.forEach((r,i)=>{
                        const box = resizeDetections[i].detection.box;
                        const drawBox = new faceapi.draw.DrawBox(box,{label: r.label});
                        setSpin(false);
                        setOpenCam("4");
                        drawBox.draw(canvas);
                    })
                }
            },100);
        }
    }
    const onNewRegister = () =>{
        if(saveChannel === ""){
            notification.error({
                message:"Bạn Chưa Chọn Channel !!!"
            });
        }else if(register.images.length !== 0){
            saveRegisters({channel: saveChannel});
            offCam(elVideo);
            history.push("/train");
        }else {
            saveRegisters({channel: saveChannel});
            offCam(elVideo);
            history.push("/capture");
        }
    }
    return (
        <div className="wrap-capture mobile">
            <div className="wrap-video mobile">
                <video 
                    ref={elVideo} 
                    playsInline autoPlay muted 
                    type='video/mp4' id="video"
                    onLoadedMetadata={e => {
                        setMetadata({
                          videoHeight: e.target.videoHeight,
                          videoWidth: e.target.videoWidth,
                          duration: e.target.duration
                        });
                      }}></video>
                <canvas id="canvas"></canvas>
                <img id="image"/>
            </div>
            <div className="wrap-button mobile">  
                <Select onChange={handleChange} defaultValue="choose channel">
                    {
                        channels.map((i,index)=>{
                            return(<Option value={i.ChannelName} key={index}>{i.ChannelName}</Option>)
                        })
                    }
                </Select>
               {openCam === "1" && <Button onClick={()=>streamCamVideo(elVideo)} type="primary">Test</Button>}
               {openCam === "2" && <Button onClick={()=>snapshot(elVideo)} type="primary">Capture</Button>}
               {openCam === "3" &&
                <Spin spinning={spin}> 
                    <Button className="button-recognition" 
                            onClick={()=>handleImage(size.width,size.height,faceDescriptions,photo)} 
                            type="primary">Recognition</Button>
                </Spin>}
                { openCam === "4" && <Button onClick={()=>clearPhoto()} type="primary">Clear</Button>}
               {/* <Button onClick={()=>stop(elVideo)} danger type="primary">Stop Cam</Button> */}
               
               {permission.permission === "admin" &&
                <Button onClick={onNewRegister} type="primary">New Register</Button>}
            </div>
            
        </div>
    )
}


export default CaptureMobile;

