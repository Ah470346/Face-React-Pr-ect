import usersApi from '../api/usersApi'; 
import recognitionApi from '../api/recognitionApi';

export const LOAD_USER = 'LOAD_USER';
export const USER_LOGIN = 'USER_LOGIN';
export const CLEAR_LOGIN = 'CLEAR_LOGIN';
export const LOAD_FACE_DETECT = "LOAD_FACE_DETECT";
export const SET_PERMISSION = "SET_PERMISSION";
export const ADD_RECOGNITION = "ADD_RECOGNITION";
export const CHANGE_RECOGNITION = "CHANGE_RECOGNITION";
export const DELETE_RECOGNITION = "DELETE_RECOGNITION";



export const loadUser = (users) =>{
    return {
        type:LOAD_USER,
        data: users 
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
        dispatch(loadFaceDetect(result));
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