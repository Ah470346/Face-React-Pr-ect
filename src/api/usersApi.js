import axiosClient from './axiosClient';

const usersApi = {
    getAll: (params) => {
        const url = '/api/users'
        return axiosClient.get(url,{params})
    },
}

export default usersApi;