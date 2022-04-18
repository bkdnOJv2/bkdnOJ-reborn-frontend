import axios from 'axios';
import { toast } from 'react-toastify';

import { __ls_get_access_token } from 'helpers/localStorageHelpers';
import { log } from 'helpers/logger';

const axiosClient = axios.create({
    baseURL: `${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}/`,
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
            log('Interceptors@Network Error detected.')
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
        if (res.status === 403) {
            // window.location.href = "/sign-in"
            toast.error("You need to Sign-in first.");
            // window.location.href = “https://example.com/login”;
        }
        log("Interceptors@Status Code: " + res.status);
        return Promise.reject(error);
    }
);

export default axiosClient;