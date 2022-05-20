import axiosClient from "api/axiosClient";
import axiosFormClient from 'api/axiosFormClient';
import {getConnectionUrl} from 'api/urls';

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
    return axiosClient.options(`/problem/${shortname}/`);
}
const adminDeleteProblem = ({shortname}) => {
    return axiosClient.delete(`/problem/${shortname}/`);
}
const adminEditProblemDetails = ({shortname, data}) => {
    return axiosClient.patch(`/problem/${shortname}/`, data);
}
const adminGetProblemDetailsData = ({shortname}) => {
    return axiosClient.get(`/problem/${shortname}/data/`);
}
const adminGetProblemDetailsTest = ({shortname, params}) => {
    return axiosClient.get(`/problem/${shortname}/data/test/`, (params && { params: {...params} }));
}

const adminEditProblemPDF = ({shortname, formData}) => {
    return axiosFormClient.patch(`${getConnectionUrl()}admin/problem/${shortname}/`, formData);
}

const problemAPI = {
    getProblems,
    getProblemDetails,
    submitToProblem,
    adminOptionsProblemDetails,
    adminDeleteProblem,
    adminEditProblemDetails,
    adminEditProblemPDF,
    adminGetProblemDetailsData,
    adminGetProblemDetailsTest,
}

export default problemAPI;