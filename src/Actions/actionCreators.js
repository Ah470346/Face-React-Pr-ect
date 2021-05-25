import usersApi from '../api/usersApi'; 

export const LOAD_USER = 'LOAD_USER';
export const USER_LOGIN = 'USER_LOGIN';
export const CLEAR_LOGIN = 'CLEAR_LOGIN';



export const loadUser = (users) =>{
    return {
        type:LOAD_USER,
        data: users 
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

export const userLogin = (user) => {
    return {
        type:USER_LOGIN,
        data: user
    }
}