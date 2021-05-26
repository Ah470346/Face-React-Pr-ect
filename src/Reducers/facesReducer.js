import {LOAD_FACE_DETECT} from '../Actions/actionCreators';

const initalState = [

];

const facesReducer = (state = initalState,action) => {
    switch(action.type){
        case LOAD_FACE_DETECT:
            return [
                ...action.data
            ]
        default:
            return state;
    }
}

export default facesReducer;