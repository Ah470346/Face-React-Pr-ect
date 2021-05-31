import axiosClient from './axiosClient';

const authApi = {
    postAuth: (data,params)=>{
        const url = '/api/auth/post';
        return axiosClient.post(url,data,params);
    }
}

export default authApi;