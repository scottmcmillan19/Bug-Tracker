import React, { useState, useContext } from 'react';
import axios from 'axios';
import UserContext from '../context/UserContext';
import { useHistory } from 'react-router-dom';

export default function Register() {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [checkPassword, setCheckPassword] = useState();
    const history = useHistory();
    const { setUserData } = useContext(UserContext);

    const submit = (e) => {
        e.preventDefault();
        const newUser = { name, email, password, checkPassword };
        // make new user and authenticate them
        axios.post('/api/users', newUser)
            .then(() => {
                axios.post("/api/auth", {
                    email, password
                })
                    .then((loginRes) => {
                        setUserData({
                            token: loginRes.data.token,
                            user: loginRes.data.user
                        })
                        localStorage.setItem("auth-token", loginRes.data.token);
                        history.push('/');
                        window.location.reload(false);
                    })
            })
    }
    return (
        <div className="register">
            <h2 className="registerTitle">Register</h2>
            <form onSubmit={submit}>
                <label htmlFor="register-name">Name</label>
                <input style={{marginLeft: "44px"}} id="register-name" type="name" onChange={e => setName(e.target.value)} /><br/>
                <label htmlFor="register-email">Email</label>
                <input style={{marginLeft: "44px" }} id="register-email" type="email" onChange={e => setEmail(e.target.value)} /><br/>
                <label htmlFor="register-password">Password</label>
                <input id="register-password" type="password" onChange={e => setPassword(e.target.value)} /><br/>
                <label htmlFor="register-password"> Re-enter<br/> Password</label>
                <input id="register-check-password" type="password" onChange={e => setCheckPassword(e.target.value)} /><br/>
                <input style={{marginLeft: "120px"}} type="submit" value="Register" />
            </form>
        </div>
    )

}

