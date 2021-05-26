import {combineReducers} from 'redux';
import userReducer from './userReducer';
import statusLoginReducer from './statusLoginReducer';
import faceReducer from './facesReducer';

const rootReducer = combineReducers({
    users: userReducer,
    status: statusLoginReducer,
    faceDetect: faceReducer
});

export default rootReducer;