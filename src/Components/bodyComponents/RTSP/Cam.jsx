import React,{useEffect,useState} from 'react';
import socketIOClient from "socket.io-client";
const ENDPOINT = "192.168.1.62:8080";




const Cam = ({opacity}) => {
    const [response, setResponse] = useState("");
    useEffect(() => {
        const socket = socketIOClient(ENDPOINT,{'forceNew':true });
        socket.on("data", data => {
            setResponse(data);
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
