import React,{useEffect,useState} from 'react';
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

function Main({fetchUser,status,fetchFaceDetect,permission}) {
    useEffect(()=>{
        fetchUser();
        fetchFaceDetect();
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
            <Header></Header>
            {
              isMobile === false ?
                <Switch>
                <Route exact path="/">
                  <CaptureDesktop></CaptureDesktop>
                </Route>
                <ProtectLoginRoute exact path="/login" protect={status.protect}>
                    <Login/>
                </ProtectLoginRoute>
                <ProtectHomeRoute exact path="/home" permission={permission.permission}>
                    <Body/>
                </ProtectHomeRoute>
                <ProtectHomeRoute exact path="/rtsp" permission={permission.permission}>
                    <Rtsp/>
                </ProtectHomeRoute>
              </Switch>
              : <CaptureMobile></CaptureMobile>
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
      render = {()=> permission === "admin" || permission ==="user" ? (
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

