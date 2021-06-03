import {LOAD_USER,SET_PERMISSION} from '../Actions/actionCreators';

const initalState = [

];

const initalState2= localStorage;

const userReducer = (state = initalState,action) => {
    switch(action.type){
        case LOAD_USER:
            return [
                ...action.data
            ]
        default:
            return state;
    }
}

export const permissionReducer = (state = initalState2,action)=>{
    switch(action.type){
        case SET_PERMISSION:
            return action.data;
        default:
            return state;
    }
}

export default userReducer;

