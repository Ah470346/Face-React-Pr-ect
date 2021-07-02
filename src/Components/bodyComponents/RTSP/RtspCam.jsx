import React, {useState} from 'react';
import {Spin,Select,notification} from 'antd';
import {useSelector,useDispatch} from 'react-redux';
import {fetchFaceDetect,addRecognition,changeRecognition,deleteRecognition} from '../../../Actions/actionCreators';
import {handlePlay} from './Recognition-rtsp';
import Play from '../../../assets/play-button.svg';
import Profile from '../../../assets/user.svg';
import CheckNetwork from '../../CheckNetwork';
import Cam from './Cam';
import channelApi from '../../../api/channelsApi';

const { Option } = Select;
    
function RtspCam(props) {
    const dispatch = useDispatch();
    const changeList = (rec) => dispatch(changeRecognition(rec));
    const addList = (rec) => dispatch(addRecognition(rec));
    const deleteItem = (label) => dispatch(deleteRecognition(label));
    const fetchFaceDetects = () => dispatch(fetchFaceDetect());

    const [openCamVideo, setOpenCamVideo] = useState(false);
    const [opacity,setOpacity] = useState("0");
    const [channelSelect,setChannelSelect] = useState("");
    const [recognition, setRecognition] = useState(false);
    const faceDescriptions = useSelector(state => state.faceDetect);
    const listItem = useSelector(state => state.listRecognition);
    const channels = useSelector(state => state.channel);

    async function handleChange(value) {
        for(let i of channels){
            if(i.ChannelName === value){
                try {
                    const response = await channelApi.changeChannel({uri:i.CameraIP});
                } catch (error) {
                    console.log(error);
                }
            }
        }
        const arr = faceDescriptions.filter((i)=>{
            return i.ChannelName === value;
        })
        setChannelSelect(value);
        setOpenCamVideo(true);
        fetchFaceDetects();
        setRecognition(false); 
        setRecognition(true);
        setOpacity("0");
        setTimeout(()=>{
            setOpacity("1");
            handlePlay(arr,addList,changeList,deleteItem);
            setOpenCamVideo(false);
            
        },1000)
    }

    const start = ()=>{
        if(channels.length === 0 || channelSelect === ""){
            notification.error({
                message: 'Yêu cầu Chọn Kênh !!!'
            });
        } else {
            const arr = faceDescriptions.filter((i)=>{
                return i.ChannelName === channelSelect;
            })
            setOpenCamVideo(true);
            fetchFaceDetects();
            setRecognition(true); 
            setTimeout(()=>{
                setOpacity("1");
                handlePlay(arr,addList,changeList,deleteItem);
                setOpenCamVideo(false);
            },1500)
        }
    }
    return (
        <div className="wrap-body rtsp">
            <div className='wrap-recognition rtsp'>
                <div id="wrap-video" className='wrap-video' >
                    <Spin spinning={openCamVideo}>
                        {recognition===true && <Cam opacity={opacity}></Cam>}
                        {recognition === false && <div className="wrap-play">
                            <img onClick={start}  src={Play} alt="" />
                        </div>}
                    </Spin>
                </div>
            </div>
            <div className='list-recognition'>
                <Select onChange={handleChange} defaultValue="choose channel">
                    {
                        channels.map((i,index)=>{
                            return(<Option value={i.ChannelName} key={index}>{i.ChannelName}</Option>)
                        })
                    }
                </Select>
                <p className='title'>Recognitations</p>
                <div className="list-item">
                    {
                        listItem.map((i,index)=>{
                            return(
                                <div className="item" >
                                    <div className="wrap-label">
                                        <img width="35" height="35" src={Profile} alt="" />
                                    </div>
                                    <div className="wrap-p">
                                        <p>{i.label}</p>
                                        <p>{i.time}</p>
                                    </div>
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

