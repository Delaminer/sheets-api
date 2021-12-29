import { useState, useEffect } from 'react';

export const useFetch = (url, body) => {
    const [state, setState] = useState({ data: null, loading: false });

    useEffect(() => {
        setState({ data: null, loading: true });
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        })
            .then(x => x.text())
            .then(y => {
                console.log("received data" + y)
                setState({ data: y, loading: false });
            })
    }, [url, setState, body]);

    return state;
}