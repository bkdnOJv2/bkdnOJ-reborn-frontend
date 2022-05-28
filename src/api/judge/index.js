import axiosClient from "api/axiosClient";

const getJudges = (params) => {
    return axiosClient.get('/judge/', (params && { params: {...params} }));
}
const getJudgeDetails = ({id}) => {
    return axiosClient.get(`/judge/${id}`);
}
const adminCreateJudge = ({data}) => {
    return axiosClient.post(`/judge/`, data);
}
const adminDeleteJudge = ({id}) => {
    return axiosClient.delete(`/judge/${id}`);
}

const judgeAPI = {
    getJudges,
    getJudgeDetails,
    adminCreateJudge,
    adminDeleteJudge,
}

export default judgeAPI;