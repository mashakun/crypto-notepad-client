import React from "react";
import { useState } from "react";
import { useForm } from 'react-hook-form';
import { useNavigate, Navigate } from "react-router-dom";

import axios from '../../axios.js';


const LoginPage = (props) => {

    const [login, setLogin] = useState(true);
    const [auth, setAuth] = useState(false);

    const { register: registerLogin, handleSubmit: handleLogin, } = useForm({
        defaultValues: {
            password: 'password',
            login: 'login'
        },
        mode: 'onChange',
    });

    const { register: registerRegister, handleSubmit: handleRegister, } = useForm({
        defaultValues: {
            email: 'mail@mail.mail',
            password: 'password',
            name: 'name',
            login: 'login'
        },
        mode: 'onChange',
    });

    const onLogin = async (values) => {

        console.log(values);

        // const data = await axios.post('/login', values);
        // console.log('login data: ', data);

        // if (!data.payload) {
        //     return alert('No authorization');
        // }

        // if ('token' in data.payload) {
        //     window.localStorage.setItem('token', data.payload.token);
        // } else {
        //     alert('No authorization');
        // }

        setAuth(true);
    }

    const onRegister = async (values) => {

        console.log(values);

        // const data = await axios.post('/register', values);
        // console.log('register data: ', data);

        // if (!data.payload) {
        //     return alert('No authorization');
        // }

        // if ('token' in data.payload) {
        //     window.localStorage.setItem('token', data.payload.token);
        // } else {
        //     alert('No authorization');
        // }

        setAuth(true);
    }

    // в это время axios чекает наличие токена и добавляет в хедер после аутентификации(??????? сработает ли)

    const navigate = useNavigate();

    if (auth) {
        navigate("/");
    }

    return (
        <div>
            <button onClick={() => setLogin(true)}>login</button>
            <button onClick={() => setLogin(false)}>register</button>

            {
                login ?
                    <form onSubmit={handleLogin(onLogin)}>
                        <input type="text" {...registerLogin("login")} required></input>
                        <input type="text" {...registerLogin("password")} required></input>

                        <button type="submit">sign in</button>
                    </form>

                    :

                    <form onSubmit={handleRegister(onRegister)}>
                        <input type="text" required {...registerRegister("login")}></input>
                        <input type="text" required {...registerRegister("password")}></input>
                        <input type="email" required {...registerRegister("email")}></input>
                        <input type="text" required {...registerRegister("name")}></input>

                        <button type="submit">sign in</button>
                    </form>
            }
        </div>
    );
};

export default LoginPage;