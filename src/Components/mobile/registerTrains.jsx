import React,{useState,useRef,useEffect} from 'react';
import {useDispatch,useSelector} from 'react-redux';
import {useHistory} from 'react-router-dom';
import {saveRegister,fetchFaceDetect} from '../../Actions/actionCreators';
import { Slide } from 'react-slideshow-image';
import {notification,Button,Spin} from 'antd';
import Remove from '../../assets/remove-mobile.svg';
import Pre from '../../assets/back.svg';
import PreBlack from '../../assets/back-black.svg';
import shortID from 'shortid';
import recognitionApi from '../../api/recognitionApi';
import Next from '../../assets/next.svg';
import CheckNetwork from "../CheckNetwork";
import * as faceapi from 'face-api.js';

function RegisterTrains(props) {
    const dispatch = useDispatch();
    const history = useHistory();
    const saveRegisters = (res) => dispatch(saveRegister(res));
    const register = useSelector((state)=> state.register);
    const fetchFaceDetects = () => dispatch(fetchFaceDetect());
    const [spin,setSpin] = useState(false);
    const elInput = useRef(null);
    const properties = {
        prevArrow:  <img width="30" height="30"  src={Pre} alt="" />,
        nextArrow: <img  width="30" height="30" src={Next} alt="" />
      };
    const onRemove = (num)=>{
        const newImages = register.images.filter((i,index)=>{
            return index !== num;
        })
        saveRegisters({images: [...newImages]});
    }
    const handleTrainImages = (data) =>{
        return Promise.all([
            data.map(async label =>{
                const descriptions = [];
                for(let i of label.images){
                    const a = document.createElement('img');
                    a.src = i;
                    const detections = await faceapi.detectAllFaces(a)
                        .withFaceLandmarks()
                        .withFaceDescriptors();
                    if(detections.length === 0 ){
                        descriptions.push([]);
                    } else  if(detections){
                        let max = 0;
                        let finalDetection;
                        for(let i of detections){
                            const area = i.alignedRect.box.width*i.alignedRect.box.height;
                            if(area > max){
                                finalDetection = i;
                                max = area
                            }
                        }
                        if(finalDetection.descriptor){
                            descriptions.push(finalDetection.descriptor);
                        }
                    } 
                   
                }
                return {label: label.label , faceDetects: descriptions,ChannelName:label.channel};
            })
        ]);
    } 
    const handleTrain = (data) =>{
        if(CheckNetwork()===false){
            notification.error({
                message: 'Yêu cầu kết nối mạng !!!',
                description:
                  'Thiết bị của bạn chưa kết nối mạng',
            });
        } else{
            setSpin(true);
            Promise.all([
                faceapi.nets.ssdMobilenetv1.load('/models')
            ]).then( async(res)=>{
                const result = [];
                const faceDetectPromise =  await handleTrainImages(data);
                // biến đếm xem có bao nhiêu ảnh không hợp lệ
                let count = 0;
                for(let i of faceDetectPromise[0]){
                    let a = await i ; 
                    let CheckedFaceDetects = [];// các ảnh đã được lọc , nếu không có khuôn mặt thì bỏ qua
                    for(let j of a.faceDetects){
                        if(j.length !==0){
                            CheckedFaceDetects.push(j);
                        }
                    }
                    if(CheckedFaceDetects.length !== 0){count++}
                    result.push({faceID: shortID.generate(),label: a.label, faceDetects: CheckedFaceDetects,ChannelName:a.ChannelName});
                }
                if(result.length === faceDetectPromise[0].length){
                    //push data to server
                    for(let i = 0 ; i < result.length ; i++){
                        let array = [];
                        for(let e of result[i].faceDetects){
                            array.push(Array.from(e).map(String));
                        }
                        await recognitionApi.postRecognition({...result[i],
                            faceDetects: array})
                    }
                    //set information up load
                    // const info = [];
                    // for(let i of result){
                    //     info.push({name: i.label, images: i.faceDetects.length, total: data.map((j)=>{if(i.label===j.label){return j.images.length}})});
                    // } 
                    //-----------------------------------------------------
                    if(count === 0){
                        notification.error({message:"Training thất bại, hãy kiểm tra lại ảnh train!!!"});
                    } else{
                        notification.success({
                            message: 'Train Hoàn Tất !!!',
                            description:
                                'Quá trình train hoàn tất !',
                        });
                    }
                    fetchFaceDetects();
                    saveRegisters({
                        channel:"",
                        images:[],
                        label:""
                    })
                    setSpin(false);
                    history.push("/");
                }
            })
        }
    }
    const onBack = ()=>{
        history.push("/capture");
    }
    const ontrain = () =>{
        if(register.channel === ""){
            notification.error({message:"Hãy chọn channel trước khi train"});
            history.push("/");
        } else if(register.images.length === 0){
            notification.error({message:"Hãy Chụp ảnh trước khi train"});
            history.push("/capture");
        } else if(elInput.current.value === undefined || elInput.current.value ===""){
            notification.error({message:"Hãy nhập employee ID trước khi train"});
        } else{
            handleTrain([{label:elInput.current.value,images:[...register.images],channel: register.channel}]);
        }
    }
    return (
        <Spin spinning={spin}>
            <div className="wrap-register-train">
                <div className="wrap-channel-train">{register.channel}</div>
                <div className="wrap-input-id">
                    <input ref={elInput} type="text" placeholder="Employee ID"/>
                </div>
                <div style={{height:`${register.height+20}px`,width:`${register.width+10}px`}} className="wrap-slide-image">
                    <Slide infinite={false} transitionDuration={300} easing="ease" autoplay={false} {...properties}>
                        {
                            register.images.map((i,index)=>{
                                return(
                                    <div className="each-slide" key={index}>
                                        <p className="page-number">{index+1}/{register.images.length}</p>
                                        <img className="delete" onClick={()=> onRemove(index)} src={Remove} alt="" />
                                        <img src={i} width={register.width} height={register.height}  alt="" />
                                    </div>
                                )
                            })
                        }
                    </Slide>
                </div>
                <div className="nav-bar">
                    <Button onClick={onBack}><img style={{marginRight:"5px"}} width="12" height="12" src={PreBlack} alt="" /> Back</Button>
                    <Button onClick={ontrain}>Train</Button>
                </div>
            </div>
        </Spin>
    )
}


export default RegisterTrains;

