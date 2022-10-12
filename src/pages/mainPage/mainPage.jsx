import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";

import axios from "../../axios.js";

const MainPage = (props) => {

    const navigate = useNavigate();
    const token = window.localStorage.getItem('token_kbrs');
    const [isText, setIsText] = useState(false);
    const [files, setFiles] = useState([]);
    const [currFile, setCurrFile] = useState({ name: null, id: null, content: null });
    const [message, setMessage] = useState('')

    useEffect(() => {
        if (!token) navigate('/auth');

        async function fetchFiles() {
            let { data } = await axios.get('/api/files', {
                headers: {
                    'Authorization': `token ${token}`
                }
            });
            return data;
        }

        fetchFiles().then((result) => {
            console.log("files: ", result.files);
            setFiles(result.files.map((el) => {
                return { name: el.name, id: el.id };
            }));
        });

    }, []);

    const onCreate = async () => {

        const { data } = await axios.post('/api/files', { name: "New_file" }, {
            headers: {
                'Authorization': `token ${token}`
            }
        });
        // console.log("Creation: ", data);

        setCurrFile({ name: data.name, id: data.id, content: "" });
        if (files.length === 0) {
            setFiles([{ name: data.name, id: data.id }]);
        } else {
            setFiles([...files, { name: data.name, id: data.id }]);
        }

        setIsText(true);
    }

    const onDelete = async () => {
        const data = await axios.delete(`/api/files/${currFile.id}`, {
            headers: {
                'Authorization': `token ${token}`
            }
        });
        // console.log("Deleted: ", data);

        let id = files.findIndex((el) => el.id === currFile.id);
        setFiles(files.splice(id, 1));
        setCurrFile({ fileName: null, id: null, content: null });
        setIsText(false);

        // console.log("files: ", files);
    }

    const onSave = async () => {
        console.log("currFile: ", currFile);
        console.log("text: ", message);
        const { data } = await axios.patch(`/api/files/${currFile.id}`, { content: message }, {
            headers: {
                'Authorization': `token ${token}`
            }
        });
        console.log("Saved: ", data);

        setCurrFile({ name: data.name, id: data.id, content: data.content });
        setIsText(true);
    }

    const onBack = async () => {
        console.log(isText);
        if (isText) {
            setIsText(false);
            setCurrFile({ name: null, id: null, content: null });
        } else {
            localStorage.removeItem("token_kbrs");
            localStorage.removeItem("sessionKey_kbrs");
            navigate('/auth');
        }
    }

    const handleMessageChange = event => {
        setMessage(event.target.value);
      };

    const handleClick = async (el, i) => {
        const { data } = await axios.get(`/api/files/${files[i].id}`, {
            headers: {
                'Authorization': `token ${token}`
            }
        });
        console.log("curr file: ", data);

        setMessage(data.content);
        setCurrFile({ name: files[i].name, id: files[i].id, content: data.content });
        setIsText(true);
    }

    return (
        <div>
            <button onClick={onCreate}>create</button>
            <button onClick={onDelete}>delete</button>
            <button onClick={onSave}>save</button>
            <button onClick={onBack}>back</button>

            {
                isText ?
                    <textarea defaultValue={message} onChange={handleMessageChange}></textarea>
                    :
                    <div>{files.map((el, i) => <button onClick={() => handleClick(el, i)} key={i}>{el.name}</button>)}</div>
            }

        </div>
    );
};

export default MainPage;