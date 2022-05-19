import axios from 'axios';
import { toast } from 'react-toastify';

import { __ls_get_access_token, __ls_remove_credentials } from 'helpers/localStorageHelpers';
import { log } from 'helpers/logger';

const test_env = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
const test_connection_url = 
    `${process.env.REACT_APP_DEV_BACKEND_URL}:${process.env.REACT_APP_DEV_BACKEND_PORT}/`
const prod_connection_url = 
    `${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}/`

const axiosClient = axios.create({
    baseURL: (test_env ? test_connection_url : prod_connection_url),
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        // 'Access-Control-Allow-Origin': '*',
    }
});

axiosClient.interceptors.request.use(
    config => {
        const access_token = __ls_get_access_token();
        if (access_token) {
            config.headers['Authorization'] = 'Bearer ' + access_token;
        }
        return config;
    },
    error => {
        Promise.reject(error)
    }
);

axiosClient.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        let error_obj = JSON.parse(JSON.stringify(error))
        if (error_obj.message && error_obj.message === 'Network Error') {
            log('Network Error detected.')
            toast.error("Cannot connect to the server. Please check your internet or contact the admins.", {
                toastId: 'network-error',
                autoClose: false,
            });

            return Promise.reject(
                {
                    'response':
                    {
                        'data':
                        {
                            'network_error':
                                "Could not connect to backend server. " +
                                "Please check your internet connection " +
                                "and try again."
                        }
                    }
                }
            );
        }

        // let res = JSON.stringify(error)
        let res = error.response;
        switch (res.status) {
            case 401:
                break;
            case 403:
                if (res.data) {
                    if (res.data.code === "token_not_valid") {
                        __ls_remove_credentials();
                    }
                }
                window.location.href = "/sign-in"
                break;
            default:
                break;
        }
        log("Interceptors@Status Code: " + res.status);
        return Promise.reject(error);
    }
);

export default axiosClient;