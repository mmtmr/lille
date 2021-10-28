//AnkiConnect
export const ankiInvoke = (action, version, params) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.addEventListener('error', () => reject('failed to issue request'));
        xhr.addEventListener('load', () => {
            try {
                const response = JSON.parse(xhr.responseText);
                if (Object.getOwnPropertyNames(response).length != 2) {
                    throw 'response has an unexpected number of fields';
                }
                if (!response.hasOwnProperty('error')) {
                    throw 'response is missing required error field';
                }
                if (!response.hasOwnProperty('result')) {
                    throw 'response is missing required result field';
                }
                if (response.error) {
                    throw response.error;
                }
                resolve(response.result);
            } catch (e) {
                console.error(e);
                reject(e);
            }
        });

        // xhr.open('POST', 'http://127.0.0.1:8765');
        xhr.open('POST', 'http://localhost:8765');
        // xhr.setRequestHeader("Content-Type", "http://localhost");
        xhr.send(JSON.stringify({ action, version, params }));
    });
}

