import React from "react";
import { useState } from "react";
import { useForm } from 'react-hook-form';
import { Navigate } from "react-router-dom";
import { decrypt, PrivateKey} from 'eciesjs'
import cls from "./loginPage.module.css";
import icon from "./VectorUser.svg";


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

    // const navigate = useNavigate();
    if (auth) {
        return <Navigate to="/" />;
    }

    return (
        <div className={cls.loginPage}>
            <button className={cls.loginButton} onClick={() => setLogin(true)}>login</button>
            <button className={cls.registerButton} onClick={() => setLogin(false)}>register</button>

            {
                login ?
                    <form className={cls.loginForm} onSubmit={handleLogin(onLogin)}>
                        <img src={icon} alt="" className={cls.icon} />
                        <input className={cls.nameInput} type="text" {...registerLogin("username")} required></input>
                        <input className={cls.passwordInput} type="text" {...registerLogin("password")} required></input>

                        <button className={cls.enterButton} type="submit">sign in</button>
                    </form>

                    :

                    <form className={cls.loginForm} onSubmit={handleRegister(onRegister)}>
                        <img src={icon} alt="" className={cls.icon} />
                        <input className={cls.nameInput} type="text" required {...registerRegister("username")}></input>
                        <input className={cls.passwordInput} type="text" required {...registerRegister("password")}></input>
                        {/* <input type="text" required {...registerRegister("email")}></input> */}

                        <button className={cls.enterButton} type="submit">sign up</button>
                    </form>
            }
        </div>
    );
};

export default LoginPage;