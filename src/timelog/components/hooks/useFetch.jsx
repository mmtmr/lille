import React, { useEffect, useState } from 'react';
import axios from 'axios'

export const useFetch = (url) => {
    const [task, setTask] = useState([]);

    useEffect(() => {
        const getTask = async () => {
            try {
                const response = await axios.get(url);
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