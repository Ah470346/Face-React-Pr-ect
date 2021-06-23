import {combineReducers} from 'redux';
import userReducer , {permissionReducer}from './userReducer';
import statusLoginReducer from './statusLoginReducer';
import faceReducer from './facesReducer';
import listRecognitionReducer from './listRecognition';
import channelReducer from './channelReducer';

const rootReducer = combineReducers({
    users: userReducer,
    status: statusLoginReducer,
    faceDetect: faceReducer,
    permission: permissionReducer,
    listRecognition: listRecognitionReducer,
    channel: channelReducer
});

export default rootReducer;