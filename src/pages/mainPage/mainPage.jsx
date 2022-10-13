import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import crypto from 'crypto';
import axios from "../../axios.js";
import cls from "./mainPage.module.css";

const MainPage = (props) => {

    const navigate = useNavigate();
    const token = window.localStorage.getItem('token_kbrs');
    const sessionKey = window.localStorage.getItem('sessionKey_kbrs');
    const iv = window.localStorage.getItem('iv_kbrs');
    const [counter, setCounter] = useState(0);
    const [isText, setIsText] = useState(false);
    const [files, setFiles] = useState([]);
    const [currFile, setCurrFile] = useState({ name: null, id: null, content: null });
    const [message, setMessage] = useState('')

    useEffect(() => {
        console.log("rerendered");
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
            // console.log("files: ", result.files);
            setFiles(result.files.map((el) => {
                return { name: el.name, id: el.id };
            }));
            if (files) setCounter(files.length);
        });

    }, [isText]);

    const onCreate = async () => {

        const { data } = await axios.post('/api/files', { name: `file_${counter}` }, {
            headers: {
                'Authorization': `token ${token}`
            }
        });

        setMessage("");
        setCurrFile({ name: data.name, id: data.id, content: "" });
        if (files.length === 0) {
            setFiles([{ name: data.name, id: data.id }]);
        } else {
            setFiles([...files, { name: data.name, id: data.id }]);
        }

        setCounter(counter + 1);
        setIsText(true);
    }

    const onDelete = async () => {
        const { data } = await axios.delete(`/api/files/${currFile.id}`, {
            headers: {
                'Authorization': `token ${token}`
            }
        });
        // console.log("Deleted: ", data);

        let id = files.findIndex((el) => el.id === currFile.id);
        setFiles(files.splice(id, 1));
        console.log("files length: ", files.length);
        setCurrFile({ name: null, id: null, content: null });
        setIsText(false);

        // console.log("files: ", files);
    }

    const onSave = async () => {
        console.log("encryption: ")
        console.log("text: ", message);
        console.log("key: ", Buffer.from(sessionKey, "hex"));
        console.log("iv: ", Buffer.from(iv, "hex"));

        const text = message;
        const cipher = crypto.createCipheriv('aes-256-cfb', Buffer.from(sessionKey, "hex"), Buffer.from(iv, "hex"));
        const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
        console.log("encrypted: ", encrypted.toString("hex"));

        const { data } = await axios.patch(`/api/files/${currFile.id}`, { content: encrypted.toString("hex") }, {
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

        const text = data.content;
        console.log("decryption: ")
        console.log("text: ", data.content);
        console.log("key: ", Buffer.from(sessionKey, "hex"));
        console.log("iv: ", Buffer.from(iv, "hex"));


        const encrypted = Buffer.from(text, 'hex');
        const decipher = crypto.createDecipheriv('aes-256-cfb', Buffer.from(sessionKey, "hex"), Buffer.from(iv, "hex"));
        const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
        console.log("decrypted: ", decrypted.toString());

        setMessage(decrypted.toString());
        setCurrFile({ name: files[i].name, id: files[i].id, content: decrypted.toString() });
        setIsText(true);
    }

    return (
        <div className={cls.mainPage}>
            <div className={cls.buttons}>
                <button className={cls.buttonCreate} onClick={onCreate}>create</button>
                <button className={cls.buttonDelete} onClick={onDelete}>delete</button>
                <button className={cls.buttonSave} onClick={onSave}>save</button>
                <button className={cls.buttonBack} onClick={onBack}>back</button>
            </div>

            {
                isText ?
                    <textarea className={cls.fileText} defaultValue={message} onChange={handleMessageChange}></textarea>
                    :
                    <div className={cls.files}>
                        {files.map((el, i) =>
                            <button className={cls.fileName} onClick={() => handleClick(el, i)} key={el.id}>
                                {el.name}
                            </button>)}
                    </div>
            }

        </div>
    );
};

export default MainPage;