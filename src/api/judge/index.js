import axiosClient from "api/axiosClient";

const getJudges = (params) => {
    return axiosClient.get('/judge/', (params && { params: {...params} }));
}
const getJudgeDetails = ({jid}) => {
    return axiosClient.get(`/judge/${jid}`);
}

const judgeAPI = {
    getJudges,
    getJudgeDetails,
}

export default judgeAPI;