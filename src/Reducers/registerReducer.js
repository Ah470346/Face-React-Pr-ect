import {SAVE_REGISTER} from '../Actions/actionCreators';

const initalState = {
    channel:"",
    images:[],
    width:"",
    height:""
};

const registerReducer = (state = initalState,action) => {
    switch(action.type){
        case SAVE_REGISTER:
            return {
                ...state,
                ...action.data
            }
        default:
            return state;
    }
}

export default registerReducer;