import axiosInstance from './AxiosInstance';

export const login = async (id, password) => {
    try {
        const response = await axiosInstance.get('/auth/login', { id, password });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getUserInfo = async () => {
    try {
        const response = await axiosInstance.get('/user');
        return response.data;
    } catch (error) {
        throw error;
    }
};
