import axiosInstance from './AxiosInstance';

export const login = async (id, password) => {
    try {
        const response = await axiosInstance.post('/auth/login', null, {
            headers: {
                'id': id,
                'password': password,
            }
        });
        console.log(response);
        return response;
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
