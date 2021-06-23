import axiosClient from './axiosClient';

const channelsApi = {
    getAll: (params) => {
        const url = '/api/channels/get'
        return axiosClient.get(url,{params})
    },
    postChannel: (data,params)=>{
        const url = '/api/channels/post'
        return axiosClient.post(url,data,params);
    },
    changeChannel:(data,params)=>{
        const url = '/'
        return axiosClient.post(url,data,params);
    },
    editChannel:(data,params)=>{
        const url = '/api/channels/edit'
        return axiosClient.post(url,data,params);
    },
    deleteChannel:(data,params)=>{
        const url = '/api/channels/delete'
        return axiosClient.post(url,data,params);
    }
}

export default channelsApi;