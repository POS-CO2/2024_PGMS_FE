import axios from 'axios';
import Swal from 'sweetalert2';


const axiosInstance = axios.create({
    baseURL: "http://alb-1042622281.ap-northeast-2.elb.amazonaws.com:8080/api",
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 10000
});

// 서버에서 토큰 받아오기
axiosInstance.interceptors.request.use(
    config => {
        // 요청 전에 공통 작업 수행 (예: 토큰 추가)
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `${token}`;
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
        let swalOptions = {
            confirmButtonText: '확인'
        }
        // 응답 에러 처리 (예: 토큰 만료 시 로그아웃)
        if (error.response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/';
        }
        if (error.response.status == 500){
            swalOptions.title = '실패!',
            swalOptions.text = error.response.data.message;
            swalOptions.icon = 'error';
        }
        Swal.fire(swalOptions);
        return Promise.reject(error);
    }
);

export default axiosInstance;

