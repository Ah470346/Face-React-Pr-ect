import React,{useEffect} from 'react';
import Header from './headerComponents/header';
import Body from './bodyComponents/body';
import Rtsp from './bodyComponents/RTSP/RtspCam';
import Login from './LoginComponent/login';
import {
    Switch,
    Route,
    Redirect,
} from "react-router-dom";
import * as faceapi from 'face-api.js';
import {isMobile} from 'react-device-detect';
import CaptureMobile from './CaptureMobile';
import CaptureDesktop from './CaptureDesktop';
import Capture from './mobile/registerCapture';
import Train from './mobile/registerTrains';

function Main({fetchUser,status,fetchFaceDetect,permission,fetchChannel}) {
    useEffect(()=>{
        fetchUser();
        fetchFaceDetect();
        fetchChannel();
        const fetchModels = async () =>{
          await faceapi.nets.faceLandmark68Net.load('/models');
          await faceapi.nets.ssdMobilenetv1.load('/models');
          await faceapi.nets.tinyFaceDetector.load('/models');
          await faceapi.nets.faceRecognitionNet.load('/models');
      } 
      fetchModels();
    },[fetchUser]);
    return (
        <div className='main'>
            {
              isMobile === false ?
                <Switch>
                <Route exact path="/">
                    <Header></Header>
                    <CaptureDesktop></CaptureDesktop>
                </Route>
                <ProtectLoginRoute exact path="/login" protect={status.protect}>
                    <Login/>
                </ProtectLoginRoute>
                <ProtectHomeRoute exact path="/home" permission={permission.permission}>
                    <Header></Header>
                    <Body/>
                </ProtectHomeRoute>
                <ProtectRTSPRoute exact path="/rtsp" permission={permission.permission}>
                    <Header></Header>
                    <Rtsp/>
                </ProtectRTSPRoute>
              </Switch>
              :
              <Switch>
                <Route exact path="/">
                  <Header></Header>
                  <CaptureMobile></CaptureMobile>
                </Route>
                <Route exact path="/login">
                  <Login></Login>
                </Route>
                <Route exact path="/capture">
                  <Header></Header>
                  <Capture></Capture>
                </Route>
                <Route exact path="/train">
                  <Header></Header>
                  <Train></Train>
                </Route>
              </Switch>
            }
        </div>
    )
}

const ProtectLoginRoute = ({protect,children,...rest})=>{
    return (
      <Route
        {...rest}
        render = {()=> protect === 'false' || protect === undefined ? (
          children
        ):
          (
            <Redirect to='/home'></Redirect>
          )
        }
      />
    )
  }

const ProtectHomeRoute = ({permission,children,...rest})=>{
  return (
    <Route
      {...rest}
      render = {()=> permission === "admin"? (
        children
      ):
        (
          <Redirect to='/login'></Redirect>
        )
      }
    />
  )
}
const ProtectRTSPRoute = ({permission,children,...rest})=>{
  return (
    <Route
      {...rest}
      render = {()=> permission === "user"? (
        children
      ):
        (
          <Redirect to='/login'></Redirect>
        )
      }
    />
  )
}

export default Main;

