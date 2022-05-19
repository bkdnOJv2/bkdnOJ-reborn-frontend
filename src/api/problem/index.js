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

const adminProblemDetailsOptions = ({shortname}) => {
    return axiosClient.options(`/problem/${shortname}`);
}

const problemAPI = {
    getProblems,
    getProblemDetails,
    submitToProblem,
    adminProblemDetailsOptions,
}

export default problemAPI;