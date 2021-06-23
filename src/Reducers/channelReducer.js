import {LOAD_CHANNEL,POST_CHANNEL} from '../Actions/actionCreators';
import channelAPI from '../api/channelsApi';

const initalState = [

];

const postChannel = async (data)=>{
    try {
        const response = await channelAPI.postChannel(data);
    } catch (error) {
        console.log(error);
    }
}

const channelsReducer = (state = initalState,action) => {
    switch(action.type){
        case LOAD_CHANNEL:
            return [
                ...action.data
            ];
        case POST_CHANNEL:
            postChannel(action.data);
        default:
            return state;
    }
}

export default channelsReducer;