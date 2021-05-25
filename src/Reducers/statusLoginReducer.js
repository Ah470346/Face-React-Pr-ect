import {USER_LOGIN,CLEAR_LOGIN} from '../Actions/actionCreators';

const initalState = localStorage;

const statusLoginReducer = (state = initalState,action) => {
    switch(action.type){
        case USER_LOGIN:
            return action.data;
        case CLEAR_LOGIN:
            return {...localStorage};
        default:
            return state;
    }
}

export default statusLoginReducer;