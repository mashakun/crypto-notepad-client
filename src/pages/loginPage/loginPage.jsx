import React from "react";
import { useState } from "react";
import { useForm } from 'react-hook-form';
import { useNavigate, Navigate } from "react-router-dom";

const LoginPage = (props) => {

    const [login, setLogin] = useState(true);
    const [auth, setAuth] = useState(false);

    // fetch auth
    // fetch register
    // они оба генерят jwt и сохраняют в localStorage
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
                    <form>
                        <input type="text" required></input>
                        <input type="text" required></input>

                        <button type="submit" onClick={() => setAuth(true)}>sign in</button>
                    </form>
                    :
                    <form>
                        <input type="text" required></input>
                        <input type="text" required></input>
                        <input type="email" required></input>
                        <input type="text" required></input>

                        <button type="submit" onClick={() => setAuth(true)}>sign in</button>
                    </form>
            }
        </div>
    );
};

export default LoginPage;