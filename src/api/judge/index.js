import axiosClient from "api/axiosClient";

const getJudges = (params) => {
    return axiosClient.get('/judge/', (params && { params: {...params} }));
}
const getJudgeDetails = ({id}) => {
    return axiosClient.get(`/judge/${id}`);
}
const adminDeleteJudge = ({id}) => {
    return axiosClient.delete(`/judge/${id}`);
}

const judgeAPI = {
    getJudges,
    getJudgeDetails,
    adminDeleteJudge,
}

export default judgeAPI;