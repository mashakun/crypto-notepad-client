import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";

import axios from "../../axios.js";

const MainPage = (props) => {

    const navigate = useNavigate();
    const [isText, setIsText] = useState(false);
    const [files, setFiles] = useState([]);
    const [currFile, setCurrFile] = useState({fileName: null, content: null});

    useEffect(() => {
        let auth = window.localStorage.getItem('token_kbrs');
        if (!auth) navigate('/auth');

        async function fetchFiles() {
            const data = await axios.get();
            return data;
        }

        const data = fetchFiles();
        setFiles(data);

    }, []);

    const onCreate = async () => {
        const newFile = {
            fileName: "New_file",
            content: "",
        }

        const data = await axios.post('/', newFile);
        console.log("Creation: ", data);

        setCurrFile({fileName: data.fileName, id: data.id, content: data.content});
        setFiles([...files, {fileName: data.fileName, id: data.id}]);
        setIsText(true);
    }

    const onDelete = async () => {
        const data = await axios.delete(`/${currFile.id}`);
        console.log("Deleted: ", data);

        let id = files.findIndex((el) => el.id === currFile.id);
        setFiles(files.splice(id, 1));
        setCurrFile({fileName: null, id: null, content: null});
        setIsText(false);
    }

    const onSave = async (text) => {
        const data = await axios.patch(`/${currFile.id}`, {content: text});
        console.log("Saved: ", data);

        setCurrFile({fileName: currFile.fileName, content: text});
        setIsText(true);
    }

    const onBack = async () => {}

    return (
        <div>
            <button>create</button>
            <button>delete</button>
            <button>save</button>
            <button>back</button>

            <textarea defaultValue={"skdjflakf"}></textarea>

        </div>
    );
};

export default MainPage;