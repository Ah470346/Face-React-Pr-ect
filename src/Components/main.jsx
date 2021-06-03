import React,{useEffect} from 'react';
import Header from './headerComponents/header';
import Body from './bodyComponents/body';
import Login from './LoginComponent/login';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";
import * as faceapi from 'face-api.js';
import {isMobile} from 'react-device-detect';
import CaptureMobile from './CaptureMobile';

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
        <Router>
            <div className='main'>
                <Header></Header>
                {
                  isMobile === false ?
                   <Switch>
                    <ProtectLoginRoute exact path="/login" protect={status.protect}>
                        <Login/>
                    </ProtectLoginRoute>
                    <Route exact path="/" permission={permission.permission}>
                        <Body/>
                    </Route>
                  </Switch>
                  : <CaptureMobile></CaptureMobile>
                }
            </div>
        </Router>
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
            <Redirect to='/'></Redirect>
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

