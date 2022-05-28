import axiosClient from "api/axiosClient";

const getUsers = (params) => {
    return axiosClient.get('/user/', (params && { params: {...params} }));
}
const getUser = ({id}) => {
    return axiosClient.get(`/user/${id}`);
}

const adminDeleteUser = ({id}) => {
    return axiosClient.delete(`/user/${id}`);
}

const userAPI = {
    getUsers,
    getUser,
    adminDeleteUser,
}

export default userAPI;