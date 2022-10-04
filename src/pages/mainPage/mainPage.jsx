import React from "react";
import { useNavigate, Navigate } from "react-router-dom";

const MainPage = (props) => {

    // явно нужен стейт со списком файлов, обновляется после create и delete
    // нужен стейт с curr файлом
    // нужен стейт с текстом curr файла



    return (
        <div>
            <button>create</button>
            <button>delete</button>
            <button>save</button>
            <button>back</button>

            <textarea>jbaslfkjskdskfn;dsjfsdkfgsdgkns</textarea>

        </div>
    );
};

export default MainPage;