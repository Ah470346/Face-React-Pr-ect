import {LOAD_USER} from '../Actions/actionCreators';

const initalState = [

];

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

export default userReducer;