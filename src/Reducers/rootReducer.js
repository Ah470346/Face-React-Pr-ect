import {combineReducers} from 'redux';
import userReducer from './userReducer';
import statusLoginReducer from './statusLoginReducer';

const rootReducer = combineReducers({
    users: userReducer,
    status: statusLoginReducer
});

export default rootReducer;