import axiosClient from './axiosClient';

const recognitionApi = {
    getAll: (params) => {
        const url = '/api/recognitions/get'
        return axiosClient.get(url,{params})
    },
    postRecognition: (data,params)=>{
        const url = '/api/recognitions/post'
        return axiosClient.post(url,data,params);
    },
    editActiveRecognition: (data,params)=>{
        const url = '/api/recognitions/editActive'
        return axiosClient.post(url,data,params);
    },
    deleteRecognition: (data,params)=>{
        const url = '/api/recognitions/delete'
        return axiosClient.post(url,data,params);
    },
    cloneRecognition: (data,params)=>{
        const url = '/api/recognitions/clone'
        return axiosClient.post(url,data,params);
    },
    moveRecognition: (data,params)=>{
        const url = '/api/recognitions/move'
        return axiosClient.post(url,data,params);
    }
}

export default recognitionApi;