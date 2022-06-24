import axiosClient from "api/axiosClient";

const getOrgs = (params) => {
    return axiosClient.get('/organizations/', (params && { params: {...params} }));
}

const orgAPI = {
    getOrgs,
}

export default orgAPI;
