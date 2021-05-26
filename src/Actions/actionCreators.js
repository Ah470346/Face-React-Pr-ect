import usersApi from '../api/usersApi'; 
import recognitionApi from '../api/recognitionApi';

export const LOAD_USER = 'LOAD_USER';
export const USER_LOGIN = 'USER_LOGIN';
export const CLEAR_LOGIN = 'CLEAR_LOGIN';
export const LOAD_FACE_DETECT = "LOAD_FACE_DETECT";



export const loadUser = (users) =>{
    return {
        type:LOAD_USER,
        data: users 
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