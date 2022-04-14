import axios from 'axios';
import {log} from 'helpers/logger';

const axiosClient = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}/`,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

axiosClient.interceptors.response.use(
  function (response) {
    return response;
  }, 
  function (error) {
    let res = error.response;
    if (res.status == 401) {
    //   window.location.href = “https://example.com/login”;
    }
    log("Looks like there was a problem. Status Code: " + res.status);
    return Promise.reject(error);
  }
);

export default axiosClient;