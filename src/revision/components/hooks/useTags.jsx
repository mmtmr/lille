import React, { useEffect, useState } from 'react';
import { ankiInvoke } from '../../../lib/anki/anki';
export const useTags = () => {
    const [tags, setTags] = useState([]);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const getTags = await ankiInvoke("getTags", 6);
                console.log(getTags);
                setTags(getTags);
            } catch (err) {
                console.log(err.message);
            }
        };
        fetchTags();
    }, []);
    return tags;
}