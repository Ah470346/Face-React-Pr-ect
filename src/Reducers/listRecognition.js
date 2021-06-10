import {ADD_RECOGNITION,CHANGE_RECOGNITION,DELETE_RECOGNITION} from '../Actions/actionCreators';

const initalState = [

];

const listRecognitionReducer = (state = initalState,action) => {
    switch(action.type){
        case ADD_RECOGNITION:
            return [
                ...state,
                action.data
            ]
        case CHANGE_RECOGNITION:
            return [
                ...state
            ]
        case DELETE_RECOGNITION:
            return state.filter((i)=>{
                console.log(i.mili,action.data);
                return i.mili !== action.data;
            })
        default:
            return state;
    }
}

export default listRecognitionReducer;