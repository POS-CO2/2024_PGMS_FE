import React, {useState, useEffect} from 'react';
import axiosInstance from '../utils/AxiosInstance';

const useFetchData = (url, interval = null) => {
    const [data, setData] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await axiosInstance.get(url);    
                setData(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();

        if (interval) {
            const intervalId = setInterval(() => {
                fetchData();
            }, interval);

            return () => clearInterval(intervalId);
        }

        
    }, [url, interval])

    return {data, isLoading};
};

export default useFetchData;