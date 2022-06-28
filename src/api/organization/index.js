import axiosClient from "api/axiosClient";

const getOrgs = ({params}) => {
    return axiosClient.get('/orgs/', (params && { params: {...params} }));
}

const orgAPI = {
    getOrgs,
}

export default orgAPI;
