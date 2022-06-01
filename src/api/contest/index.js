import axiosClient from "api/axiosClient";

const getContests = (params) => {
    return axiosClient.get('/contest/', (params && { params: {...params} }));
}
const getPastContests = (params) => {
    return axiosClient.get('/past-contest/', (params && { params: {...params} }));
}

const getContest = ({ key }) => {
    return axiosClient.get(`/contest/${key}/`);
}
const joinContest = ({ key }) => {
    return axiosClient.post(`/contest/${key}/participate/`);
}
const leaveContest = ({ key }) => {
    return axiosClient.post(`/contest/${key}/leave/`);
}
const getContestStanding = ({ key }) => {
    return axiosClient.get(`/contest/${key}/standing/`);
}
const getContestSubmissions = ({ key, params }) => {
    return axiosClient.get(`/contest/${key}/submission/`, (params && { params: {...params} }));
}
const getContestProblems = ({ key, params }) => {
    return axiosClient.get(`/contest/${key}/problem/`, (params && { params: {...params} }));
}
const getContestProblem = ({ key, shortname, params }) => {
    return axiosClient.get(`/contest/${key}/problem/${shortname}/`, (params && { params: {...params} }));
}
const submitContestProblem = ({ key, shortname, data }) => {
    return axiosClient.post(`/contest/${key}/problem/${shortname}/submit/`, data );
}
const getContestProblemSubmissions = ({ key, shortname, params }) => {
    return axiosClient.get(`/contest/${key}/problem/${shortname}/submission/`, (params && { params: {...params} }));
}
const getContestProblemSubmission = ({ key, shortname, id }) => {
    return axiosClient.get(`/contest/${key}/problem/${shortname}/submission/${id}/`);
}

const contestAPI = {
    getContests, getPastContests, getContest,

    joinContest, leaveContest, 

    getContestStanding, 
    getContestSubmissions, 
    getContestProblems, getContestProblem, submitContestProblem,
    getContestProblemSubmissions, getContestProblemSubmission,
}

export default contestAPI;