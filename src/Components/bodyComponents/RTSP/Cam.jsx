import React,{useEffect,useState} from 'react';
import socketIOClient from "socket.io-client";
import store from '../../../store/store';
import {fetchFaceDetect} from '../../../Actions/actionCreators';
const ENDPOINT = "http://192.168.1.62:8080";




const Cam = ({opacity}) => {
    const [response, setResponse] = useState("");
    let max = 0;
    useEffect(() => {
        const socket = socketIOClient(ENDPOINT,{'forceNew':true });
        socket.on("data", data => {
            setResponse(data.data);
            console.log(data.a);
            // if(data.a !== max){
            //     store.dispatch(fetchFaceDetect());
            //     max = data.a;
                
            // }
        });
        return () => {socket.disconnect();socket.close()};
    }, []);
    return (
        <img 
            style={{opacity:opacity}} 
            id="imgSocket" 
            className="socket" 
            src={'data:image/jpeg;base64,' + response} 
            alt={response === "" ? "Loading..." : "" } />
    );
};



export default Cam;
