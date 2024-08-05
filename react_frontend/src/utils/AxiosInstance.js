import axios from 'axios';


const axiosInstance = axios.create({
    baseURL: "http://3.36.105.2:8080/api",
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 10000
});

axiosInstance.interceptors.request.use(
    config => {
        // 요청 전에 공통 작업 수행 (예: 토큰 추가)
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        // 응답 에러 처리 (예: 토큰 만료 시 로그아웃)
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;