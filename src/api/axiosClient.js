import axios from 'axios';
import queryString from 'query-string';

const axiosClient = axios.create({
    baseURL: "https://15d6d370b02f.ngrok.io",
    headers: {
        'content-type': 'application/json'
    },
    paramsSerializer: params => queryString.stringify(params)
});

axiosClient.interceptors.request.use(async(config)=>{
    //handel token here....
    return config;
})

axiosClient.interceptors.response.use((res)=>{
    if(res && res.data){
        return res.data;
    }
    return res;
    },error=>{
        throw error;
});

export default axiosClient;