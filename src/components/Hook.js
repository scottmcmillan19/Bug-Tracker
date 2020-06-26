import React, {useState, Component, useEffect, useContext} from 'react';
import UserContext from '../context/UserContext';
import App from './App';
import axios from 'axios';
export default function Hook() {
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
            axios.post("/api/auth/tokenIsValid", null,
            {headers: {"x-auth-token": token}})
                .then(tokenRes => {
                    if (tokenRes.data) {
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

