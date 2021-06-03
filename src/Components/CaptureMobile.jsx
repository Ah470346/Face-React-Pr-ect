import React,{useState,useRef} from 'react';
import { Button ,notification} from 'antd';

function CaptureMobile(props) {
    const [openCam,setOpenCam] = useState(false);
    const elVideo = useRef();

    const streamCamVideo = (video) => {
        const constraints = {audio : false,video : true};
        navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function(mediaStream) {
            setOpenCam(true);
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
            
          }); // always check for errors at the end.
    }
    const snapshot = ()=>{
        let canvas , ctx,video;
        video = document.getElementById("video");
        canvas = document.getElementById("canvas");
        console.log(canvas,video);
        ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0,0, canvas.width, canvas.height);
    }
    const stop = (video) => {
        const stream = video.current.srcObject;
        const tracks = stream.getTracks();
        // const canvas = document.getElementsByTagName('canvas');
        // const wrapVideo = document.getElementById('wrap-video');
        // wrapVideo.removeChild(canvas[0])
        tracks.forEach(function(track) {
            track.stop();
        });

        video.current.srcObject = null;
        snapshot();
        setOpenCam(false);
        
    }
    return (
        <div className="wrap-capture">
            <div className="wrap-video">
                <video ref={elVideo} playsInline autoPlay muted type='video/mp4' id="video"></video>
                <canvas id="canvas"></canvas>
            </div>
            <div className="wrap-button">
               {openCam === false ? <Button onClick={()=>streamCamVideo(elVideo)} type="primary">Mở Camera</Button>
               : <Button onClick={()=>stop(elVideo)} type="primary">Chụp Ảnh</Button>}
            </div>
        </div>
    )
}


export default CaptureMobile;

