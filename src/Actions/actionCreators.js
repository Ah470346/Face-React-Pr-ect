import usersApi from '../api/usersApi'; 
import recognitionApi from '../api/recognitionApi';
import channelApi from '../api/channelsApi';

export const LOAD_USER = 'LOAD_USER';
export const USER_LOGIN = 'USER_LOGIN';
export const CLEAR_LOGIN = 'CLEAR_LOGIN';
export const LOAD_FACE_DETECT = "LOAD_FACE_DETECT";
export const SET_PERMISSION = "SET_PERMISSION";
export const ADD_RECOGNITION = "ADD_RECOGNITION";
export const CHANGE_RECOGNITION = "CHANGE_RECOGNITION";
export const DELETE_RECOGNITION = "DELETE_RECOGNITION";
export const LOAD_CHANNEL = "LOAD_CHANNEL";
export const POST_CHANNEL = "POST_CHANNEL";
export const SAVE_REGISTER = "SAVE_REGISTER";



export const loadUser = (users) =>{
    return {
        type:LOAD_USER,
        data: users 
    }
}

export const saveRegister = (register) =>{
    return {
        type:SAVE_REGISTER,
        data: register
    }
}

export const postChannel = (channel) =>{
    return {
        type:POST_CHANNEL,
        data: channel 
    }
}

export const loadChannel = (channels) =>{
    return {
        type:LOAD_CHANNEL,
        data: channels 
    }
}


export const deleteRecognition = (mili)=>{
    return {
        type:DELETE_RECOGNITION,
        data: mili 
    }
}

export const addRecognition = (rec) => {
    return {
        type:ADD_RECOGNITION,
        data: rec 
    }
}

export const changeRecognition = (rec) => {
    return {
        type:CHANGE_RECOGNITION,
        data: rec 
    }
}

export const loadFaceDetect = (faces)=>{
    return {
        type:LOAD_FACE_DETECT,
        data: faces 
    }
}

export const clearLogin = () =>{
    return {
        type:CLEAR_LOGIN
    }
}

export const setPermission = (user) =>{
    return {
        type:SET_PERMISSION,
        data: user
    }
}


export const fetchUser = () => async (dispatch) => {
    try {
        const response = await usersApi.getAll();
        dispatch(loadUser(response));
    } catch (error) {
        console.log(error);
    }

}

export const fetchChannel = () => async (dispatch) => {
    try {
        const response = await channelApi.getAll();
        dispatch(loadChannel(response));
    } catch (error) {
        console.log(error);
    }

}

export const fetchFaceDetect = () => async (dispatch) => {
    try {
        const response = await recognitionApi.getAll();
        const result = response.map((l)=>{
            const array = []
            for (let i of l.faceDetects){
                array.push(Float32Array.from(i.map((e)=> parseFloat(e))));
            }
            return {...l,faceDetects: array};
        })
        dispatch(loadFaceDetect(result.filter((i)=> {return i.isDelete !== true} )));
    } catch (error) {
        console.log(error);
    }

}

export const userLogin = (user) => {
    return {
        type:USER_LOGIN,
        data: user
    }
}