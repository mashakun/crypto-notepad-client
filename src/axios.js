import axios from "axios";

const instance = axios.create({
    // baseURL: 'http://notepad.nikuchin.fun',
    baseURL: 'http://localhost:3001',
});


export default instance;
