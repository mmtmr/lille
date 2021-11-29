import React from "react";
import Alert from 'react-bootstrap/Alert';
export const GoogleAuth = () => {

    return (
        <Alert show={true} variant={'warning'}>
            <Alert.Body>
                <p>Please Log In to <Alert.Link href="/auth/google">Google</Alert.Link> first.</p>
            </Alert.Body>
        </Alert>
    );
};
