import {combineReducers} from 'redux';
import userReducer , {permissionReducer}from './userReducer';
import statusLoginReducer from './statusLoginReducer';
import faceReducer from './facesReducer';

const rootReducer = combineReducers({
    users: userReducer,
    status: statusLoginReducer,
    faceDetect: faceReducer,
    permission: permissionReducer
});

export default rootReducer;