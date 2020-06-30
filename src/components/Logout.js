import React from 'react';
import { useHistory } from 'react-router-dom';

export default function Logout() {
    const history = useHistory();
    // set token to null on logout
    this.props.setUserData({
        token: undefined,
        user: undefined
    })
    localStorage.setItem("auth-token", "");
    history.push("/");
    window.location.reload(false);
}

