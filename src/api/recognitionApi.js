import axiosClient from './axiosClient';

const recognitionApi = {
    getAll: (params) => {
        const url = '/api/recognitions/get'
        return axiosClient.get(url,{params})
    },
    postRecognition: (data,params)=>{
        const url = '/api/recognitions/post'
        return axiosClient.post(url,data,params);
    }
}

export default recognitionApi;