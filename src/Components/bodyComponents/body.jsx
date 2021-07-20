import React, {useState ,useEffect} from 'react';
import { Button ,notification,Input,Spin,Select} from 'antd';
import * as canvas from 'canvas';
import {useSelector,useDispatch} from 'react-redux';
import {fetchFaceDetect} from '../../Actions/actionCreators';
import * as faceapi from 'face-api.js';
import InputFile from './InputFile';
import TrainStatus from './trainStatus';
import ListTrain from './listTrain';
import Channel from './channel';
import CheckNetwork from "../CheckNetwork";
import Home from '../../assets/home.svg';
import HomeUnSelect from '../../assets/homeUnSelect.svg';
import Screen from '../../assets/monitor.svg';
import ScreenUnSelect from '../../assets/monitorUnSelect.svg';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSearch,faPlus,faExchangeAlt} from '@fortawesome/free-solid-svg-icons';
import Modify from './modify';

const { Option } = Select;

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
    const [reload,setReload] = useState(false);
    const [spin,setSpin] = useState(false);
    const [showModal,setShowModal] = useState(false);
    const [showModalInput,setShowModalInput] = useState(false);
    const [showModalModify,setShowModalModify] = useState(false);
    const [info,setInfo] = useState([]);
    const [filter,setFilter] = useState([]);
    const [slideBar,setSlideBar]=useState("Home");
    const faceDescriptions = useSelector(state => state.faceDetect);
    const channels = useSelector(state => state.channel);

    const handleChange = (value)=>{
        console.log(value);
        if(value !== "" && value !=="All of channel"){
            setFilter(faceDescriptions.filter((i,index)=>{
                return i.ChannelName.includes(value);
            }));
        } else {
            setFilter([...faceDescriptions]);
        }
    }
    const onChange = (value) => {
        if(value.target.value !== "" ){
            setFilter(filter.filter((i,index)=>{
                return i.label.includes(value.target.value);
            }).sort((a,b)=>{return b.Active - a.Active}));
        } else {
            setFilter([...faceDescriptions]);
        }
    };

    const onHome = ()=>{
        fetchFaceDetects();
        setSpin(true);
        if(CheckNetwork()===false){
            notification.error({
                message: 'Yêu cầu kết nối mạng !!!',
                description:
                  'Thiết bị của bạn chưa kết nối mạng',
            });
        } else{
            setSlideBar("Home");
        } 
        setTimeout(()=>{
            setSpin(false);
        },500);
        
    }

    const onChannel = ()=>{
        fetchFaceDetects();
        setSpin(true);
        if(CheckNetwork()===false){
            notification.error({
                message: 'Yêu cầu kết nối mạng !!!',
                description:
                    'Thiết bị của bạn chưa kết nối mạng',
            });
        }else {
            setSlideBar("Channel");
        }
        setTimeout(()=>{
            setSpin(false);
        },500)
    }
    useEffect(()=>{
        const loadModal = ()=>{
            if(info.length !== 0){
                setShowModal(true);
            }
        }
        loadModal();
    },[reload]);
    useEffect(()=>{
        const elFilter = document.querySelector(".search-folder input");
        const saveFilter = ()=>{
            if(elFilter !== null){
                if(elFilter.value !== ""){
                    setFilter(faceDescriptions.filter((i,index)=>{
                        return i.label.includes(elFilter.value);
                    }));
                } else {
                    setFilter([...faceDescriptions]);
                }
            }
        }
        saveFilter();
    },[faceDescriptions]);
    return (
        <div className="wrap-body">
            <Spin spinning={spin} wrapperClassName="body-spin">
            <div className="side-bar">
                <div className="home" onClick={onHome}>
                    {slideBar === "Home" ? <img width="30"  height="30" src={Home} alt="" />
                    : <img width="30"  height="30" src={HomeUnSelect} alt="" />}
                    <p style={{color:slideBar === "Home" && "rgb(19, 19, 134)"}}>Home</p>
                </div>
                <div className="channel" onClick={onChannel}>
                    {slideBar === "Channel" ? <img width="30"  height="30" src={Screen} alt="" />
                    : <img width="30"  height="30" src={ScreenUnSelect} alt="" />}
                    <p  style={{color:slideBar === "Channel" && "rgb(19, 19, 134)"}}>Channel</p>
                </div>
            </div>
            {slideBar === "Home" && 
            <div className='wrap-content'>
                <div className='wrap-button'>
                    <p>List Trains</p>
                    <div className="group-button">
                        <Button onClick={()=> setShowModalInput(true)} className="button add-user"><FontAwesomeIcon className="icon" icon={faPlus}></FontAwesomeIcon>ADD USER</Button>
                        <Button onClick={()=> setShowModalModify(true)} className="button modify"><FontAwesomeIcon className="icon" icon={faExchangeAlt}></FontAwesomeIcon>CHANGE</Button>
                    </div>
                </div>
                <div className="wrap-search">
                    <Input className='search-folder' size='large' placeholder="Search" prefix={<FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>} onChange={onChange} />
                    <Select onChange={handleChange} defaultValue="All of channel">
                        <Option value={"All of channel"}>All of channel</Option>
                        {
                            channels.map((i,index)=>{
                                return(<Option value={i.ChannelName} key={index}>{i.ChannelName}</Option>)
                            })
                        }
                    </Select>
                </div>
                <div className='wrap-list-train'>
                    <ListTrain filter={filter}></ListTrain>
                </div>
            </div>}
            {slideBar ==="Channel" &&
                <Channel></Channel>
            }
            <div className="slide-right"></div>
            {showModal === true && <TrainStatus info={info} setInfo={setInfo} faceDetect={faceDescriptions} setShowModal={setShowModal}></TrainStatus>}
            {showModalInput === true && <InputFile setShow={setShowModalInput} setReload={setReload} reload={reload} setInfo={setInfo}></InputFile>}
            {showModalModify === true && <Modify setShowModalModify={setShowModalModify}></Modify>}
            </Spin>
        </div>
    )
}


export default Body;

