import {combineReducers} from 'redux';
import userReducer , {permissionReducer}from './userReducer';
import statusLoginReducer from './statusLoginReducer';
import faceReducer from './facesReducer';
import listRecognitionReducer from './listRecognition';

const rootReducer = combineReducers({
    users: userReducer,
    status: statusLoginReducer,
    faceDetect: faceReducer,
    permission: permissionReducer,
    listRecognition: listRecognitionReducer
});

export default rootReducer;