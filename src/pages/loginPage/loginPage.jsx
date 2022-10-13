import React from "react";
import { useState } from "react";
import { useForm } from 'react-hook-form';
import { useNavigate, Navigate } from "react-router-dom";
import { decrypt, PrivateKey, PublicKey } from 'eciesjs'

import axios from '../../axios.js';


const LoginPage = (props) => {

    const [login, setLogin] = useState(true);
    const [auth, setAuth] = useState(false);

    const { register: registerLogin, handleSubmit: handleLogin, } = useForm({
        defaultValues: {
            password: 'password',
            username: 'login'
        },
        mode: 'onChange',
    });

    const { register: registerRegister, handleSubmit: handleRegister, } = useForm({
        defaultValues: {
            email: 'mail@mail.mail',
            password: 'password',
            username: 'login'
        },
        mode: 'onChange',
    });

    const onLogin = async (values) => {

        console.log(values);

        const {data} = await axios.post('/api/auth/login', values);
        console.log('login data: ', data);

        window.localStorage.setItem('token_kbrs', data.token);
        // window.localStorage.setItem('userId_kbrs', data.userId);
        const sessionKey = decrypt(window.localStorage.getItem('ecies_key_kbrs'), Buffer.from(data.encSessionKey, "hex")).toString();
        // console.log("session key: ", sessionKey);
        window.localStorage.setItem('sessionKey_kbrs', sessionKey);
        window.localStorage.setItem('iv_kbrs', data.iv);

        setAuth(true);
    }

    const onRegister = async (values) => {

        const privateKey = new PrivateKey();
        const publicKey = privateKey.publicKey.toHex();

        let req = { username: values.username, password: values.password, publicKey: publicKey };
        console.log("req: ", req);

        const data = await axios.post('/api/auth/signup',
            { username: values.username, password: values.password, publicKey: publicKey });

        if (data) {
            window.localStorage.setItem('ecies_key_kbrs', privateKey.toHex());
            console.log('register data: ', data);
            setLogin(true);
        } else {
            console.log("no registration");
        }
    }

    const navigate = useNavigate();
    if (auth) {
        return <Navigate to="/" />;
    }

    return (
        <div>
            <button onClick={() => setLogin(true)}>login</button>
            <button onClick={() => setLogin(false)}>register</button>

            {
                login ?
                    <form onSubmit={handleLogin(onLogin)}>
                        <input type="text" {...registerLogin("username")} required></input>
                        <input type="text" {...registerLogin("password")} required></input>

                        <button type="submit">sign in</button>
                    </form>

                    :

                    <form onSubmit={handleRegister(onRegister)}>
                        <input type="text" required {...registerRegister("username")}></input>
                        <input type="text" required {...registerRegister("password")}></input>
                        <input type="text" required {...registerRegister("email")}></input>

                        <button type="submit">sign up</button>
                    </form>
            }
        </div>
    );
};

export default LoginPage;