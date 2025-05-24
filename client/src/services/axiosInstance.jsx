import axios from 'axios';
import {getUserData} from "@/recoil/auth/recoilHelper";

const axiosInstance = axios.create();


axiosInstance.interceptors.request.use(config => {
        const userData = getUserData();
        if (userData) {
            config.headers = { Authorization: 'Bearer ' + userData.token }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터 설정
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        if(error.status === 401){
           window.location.href = '/logout';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
