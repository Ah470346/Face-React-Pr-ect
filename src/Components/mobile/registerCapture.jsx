import React,{useRef,useState} from 'react';
import {useDispatch,useSelector} from 'react-redux';
import {saveRegister} from '../../Actions/actionCreators';
import {Link} from 'react-router-dom';
import Pre from '../../assets/back.svg';
import Next from '../../assets/next.svg';

function RegisterCapture(props) {
    const dispatch = useDispatch();
    const saveRegisters = (res) => dispatch(saveRegister(res));
    const register = useSelector((state)=> state.register);
    const [metadata, setMetadata] = useState("");
    const elVideo = useRef(null);
    console.log(register);
    return (
        <div className="wrap-register-capture">
            <div className="wrap-channel-register">
                <p>{register.channel}</p>
            </div>
            <div className="wrap-capture-register">
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
                <div className="navigation-bar">
                    <Link className="pre" to="/">
                        <img src="" alt="" />
                    </Link>
                        
                    <div className="capture">
                        <button></button>
                    </div>
                    <Link className="next" to="/train">
                        <img src="" alt="" />
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default RegisterCapture;

