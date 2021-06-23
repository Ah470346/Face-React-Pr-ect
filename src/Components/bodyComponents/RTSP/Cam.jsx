import React,{useEffect,useState} from 'react';
import socketIOClient from "socket.io-client";
import {notification} from 'antd';
const ENDPOINT = "http://localhost:8080";




const Cam = ({opacity}) => {
    const [response, setResponse] = useState("");
    useEffect(() => {
        const socket = socketIOClient(ENDPOINT);
        socket.on("data", data => {
            setResponse(data);
        });
        return () => {socket.disconnect()};
    }, []);
    return (
        <img 
            style={{opacity:opacity}} 
            id="imgSocket" 
            className="socket" 
            src={'data:image/jpeg;base64,' + response} 
            alt={"Loading..."} />
    );
};



export default Cam;
