import React, { useEffect, useState } from 'react';
import axios from 'axios'

export const useFetch = (url) => {
    const [task, setTask] = useState(null);

    useEffect(() => {
        const getTask = async () => {
            try {
                const response = await axios.get(url,{headers: { jwt_token: localStorage.token, rt_token: localStorage.refreshToken, user_id: localStorage.user_id }});
                const data = await response?.data;
                setTask(data);
            } catch (err) {
                console.log(err.message);
            }
        };
        getTask();
    }, [url]);
    return task;
}