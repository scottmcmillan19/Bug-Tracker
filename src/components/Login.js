import React, { useState, useContext } from 'react';
import axios from 'axios';
import UserContext from '../context/UserContext';
import { useHistory, Redirect } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [err, setErr] = useState(false);
    const { setUserData } = useContext(UserContext);
    const history = useHistory();
    const submit = (e) => {
        e.preventDefault();
        const loginUser = { email, password };
        axios.post('/api/auth', loginUser)
            .then(loginRes => {
                setUserData({
                    token: loginRes.data.token,
                    user: loginRes.data.user
                })
                localStorage.setItem("auth-token", loginRes.data.token);
                history.push("/");
                window.location.reload(false);
            })
            .catch(err => {
                setErr(true)
            });
    };
    return (
        <div className="login">
            <h2 className="registerTitle">Login</h2>
            {err ? <div className="loginErr">You need to enter proper credentials</div> : null}
            <form onSubmit={submit}>
                <label htmlFor="login-email">Email</label>
                <input style={{marginLeft: "44px"}} id="login-email" type="email" onChange={e => setEmail(e.target.value)} /><br/>
                <label htmlFor="login-password">Password</label>
                <input id="login-password" type="password" onChange={e => setPassword(e.target.value)} /><br/>
                <input type="submit" value="Login" />
            </form>
        </div>

    )
}

