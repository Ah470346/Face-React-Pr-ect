import React,{useRef,useState,useEffect} from 'react';
import {useDispatch,useSelector} from 'react-redux';
import {saveRegister} from '../../Actions/actionCreators';
import {Link} from 'react-router-dom';
import Pre from '../../assets/back.svg';
import Next from '../../assets/next.svg';
import Play from '../../assets/play-button.svg';
import CheckNetwork from "../CheckNetwork";
import Switch from '../../assets/switch.svg';
import {notification} from 'antd';
import {checkScreen} from '../CaptureMobile';


function RegisterCapture(props) {
    const dispatch = useDispatch();
    const saveRegisters = (res) => dispatch(saveRegister(res));
    const register = useSelector((state)=> state.register);
    const [metadata, setMetadata] = useState("");
    const [screenOrientation, setScreenOrientation] = useState(false);
    const [count, setCount] = useState(2);
    const [cam, setCam] = useState("user");
    const elVideo = useRef(null);
    const [openCam,setOpenCam] = useState("1");
    
    let canvas , ctx,video ,photo;
    video = document.getElementById("video1");
    canvas = document.getElementById("canvas1");
    // photo = document.getElementById("image1");

    window.addEventListener("orientationchange", ()=>{setScreenOrientation(!screenOrientation);}, false);

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

    const switchCam = () =>{
        const nav = document.getElementById("nav");
        const navBG = document.getElementById("nav-bg");
        nav.style.opacity="0";
        navBG.style.opacity="0";
        video.style.background = "black";
        offCam(elVideo);
        video.style.transform = `rotateY(${count*180}deg)`;
        setCount(count+1);
        if(cam === "user"){
            setCam("environment");
        } else {
            setCam("user");
        }
        
        setTimeout(()=>{
            video.style.background = "none";
        },500);
        setTimeout(()=>{
            nav.style.opacity="1";
            navBG.style.opacity="0.2";
        },1000);
       
    }
    useEffect(()=>{
        if(count > 2) {
            streamCamVideo(elVideo);
        }
    },[cam])

    const streamCamVideo = (video) => {
        if(CheckNetwork()===false){
            notification.error({
                message: 'Yêu cầu kết nối mạng !!!',
                description:
                  'Thiết bị của bạn chưa kết nối mạng',
            });
        } else if(screenOrientation === true){
            notification.error({
                message: 'Quay màn hình dọc để chụp ảnh!!!',
                description:
                  'Thiết bị của bạn đang ở chế độ màn hình ngang hãy quay dọc màn hình để chụp ảnh',
            });
        }else{
            const constraints = {audio : false,video :
                {width: { min: 640, ideal: 1920, max: 1920 },
                height: { min: 400, ideal: 1080 },
                aspectRatio: 1.511111,
                facingMode: cam} };
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
            const instance = checkScreen(metadata.videoWidth,metadata.videoHeight,vd);
            canvas.setAttribute('width',instance.width);
            canvas.setAttribute('height', instance.height);
            ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0,0, canvas.width, canvas.height);

            setOpenCam("2");
            const videoBG = document.getElementById("vd-bg");
            videoBG.style.display="inline-block";
            let data = canvas.toDataURL('image/png');
            saveRegisters({images:[...register.images,data],width:instance.width,height:instance.height});
            setTimeout(()=>{
                videoBG.style.display="none";
                ctx.clearRect(0,0, canvas.width, canvas.height);
            },300);
            // photo.setAttribute('width',instance.width);
            // photo.setAttribute('height', instance.height);
            // photo.setAttribute('src', data);
        }
    }
    const checkImageExist = ()=>{
        if(register.images.length === 0){
            return "/capture";
        }else if(register.channel === ""){
            return("/");
        } else {
            return "/train";
        }
    }
    const onClickNext = ()=>{
        if(checkImageExist()==="/capture"){
            notification.error({message:"Danh sách ảnh trống, Bạn chưa chụp ảnh!!!"});
        } else if(checkImageExist()==="/") {
            notification.error({message:"Hãy chọn channel trước khi train!!!"});
            offCam(elVideo)
        }else {
            offCam(elVideo);
        }
    }
    useEffect(()=>{
        if(openCam==="2"){
            const nav = document.getElementById("nav");
            const navBg = document.getElementById("nav-bg");
            const width = checkScreen(metadata.videoWidth,metadata.videoHeight,elVideo).width;
            nav.style.width = `${width}px`;
            navBg.style.width = `${width}px`;
        }
    },[metadata.videoWidth]);
    return (
        <div className="wrap-register-capture">
            <div className="wrap-channel-register">
                <p>{register.channel}</p>
            </div>
            <div className="wrap-capture-register">
                {openCam==="2" && <img onClick={switchCam} className="switch-cam" src={Switch} alt="" />}
                <div id="vd-bg" className="video-bg"></div>
                <video 
                    ref={elVideo} 
                    playsInline autoPlay muted 
                    type='video/mp4' id="video1"
                    onLoadedMetadata={e => {
                        setMetadata({
                            videoHeight: e.target.videoHeight,
                            videoWidth: e.target.videoWidth,
                            duration: e.target.duration
                        });
                        }}></video>
                {openCam === "1"  && <div className="open-cam" onClick={()=> streamCamVideo(elVideo)}>
                    <img src={Play} alt="" />
                    <p>OPEN</p>
                </div>}
                <canvas id="canvas1"></canvas>
                {/* <img id="image1"/> */}
                {openCam === "2" && <div id="nav" className="navigation-bar">
                    <Link onClick={()=>offCam(elVideo)} className="pre" to="/">
                        <img src={Pre} alt="" />
                    </Link>
                        
                    <div className="capture">
                        <button onClick={()=>snapshot(elVideo)}></button>
                    </div>
                    <Link className="next" onClick={onClickNext} to={checkImageExist()}>
                        <img src={Next} alt="" />
                    </Link>
                </div>}
                {openCam === "2" && <div id="nav-bg" className="navigation-bar-background"></div>}
            </div>
        </div>
    )
}

export default RegisterCapture;

