import axiosClient from "api/axiosClient";

const getProblems = (params) => {
    return axiosClient.get('/problem/', (params && { params: {...params} }));
}
const getProblemDetails = ({shortname}) => {
    return axiosClient.get(`/problem/${shortname}`);
}
const submitToProblem = ({name, data}) => {
    return axiosClient.post(`/problem/${name}/submit/`, JSON.stringify(data));
}

const adminOptionsProblemDetails = ({shortname}) => {
    return axiosClient.options(`/problem/${shortname}`);
}
const adminGetProblemDetailsData = ({shortname}) => {
    return axiosClient.get(`/problem/${shortname}/data`);
}
const adminGetProblemDetailsTest = ({shortname, params}) => {
    return axiosClient.get(`/problem/${shortname}/data/test`, (params && { params: {...params} }));
}

const problemAPI = {
    getProblems,
    getProblemDetails,
    submitToProblem,
    adminOptionsProblemDetails,
    adminGetProblemDetailsData,
    adminGetProblemDetailsTest,
}

export default problemAPI;