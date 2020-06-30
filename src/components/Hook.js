import React, {useState, useEffect } from 'react';
import App from './App';
import axios from 'axios';

export default function Hook() {
    // keep track of the logged in user
    const [userData, setUserData] = useState({
        token: undefined,
        user: undefined
    })
    useEffect(() => {
        const checkLoggedIn = () => {
            let token = localStorage.getItem("auth-token");
            if (token === null) {
                localStorage.setItem("auth-token", "");
                token = "";
            }
            // verify validity with the jwt secret
            axios.post("/api/auth/tokenIsValid", null,
            {headers: {"x-auth-token": token}})
                .then(tokenRes => {
                    if (tokenRes.data) {
                        // get the user info
                        axios.get("/api/auth/user", {headers: {"x-auth-token": token}})
                            .then(user => {
                                setUserData({
                                    token,
                                    user: user.data
                                })
                            })
                    }
                })
        }
        checkLoggedIn();
    }, []);

    return <App userData={userData} setUserData={setUserData}/>
}

