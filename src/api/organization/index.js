import axiosClient from "api/axiosClient";

const getOrgs = ({params}) => {
    return axiosClient.get('/orgs/', (params && { params: {...params} }));
}

const getMyOrgs = () => {
    return axiosClient.get('/orgs/my/', );
}

const getOrg = ({ slug, params }) => {
    return axiosClient.get(`/org/${slug}/`, (params && { params: {...params} }));
}

const orgAPI = {
    getOrgs, getMyOrgs,
    getOrg,
}

export default orgAPI;
