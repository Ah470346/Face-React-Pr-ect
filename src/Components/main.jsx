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

function Main({fetchUser,status,fetchFaceDetect}) {
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
                <Switch>
                    <ProtectLoginRoute exact path="/login" protect={status.protect}>
                        <Login/>
                    </ProtectLoginRoute>
                    <Route exact path="/">
                        <Body/>
                    </Route>
                </Switch>
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

export default Main;

