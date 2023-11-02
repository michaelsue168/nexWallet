import axios from 'axios';

const APIServer = axios.create({
    baseURL: 'http://127.0.0.1:8000/', //Backend URL
    timeout: 60000,
    withCredentials: true,
  });
export default APIServer;
