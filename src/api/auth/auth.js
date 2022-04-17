import axiosClient from "api/axiosClient";

const signIn = (data) => {
    return axiosClient.post('/sign-in/', JSON.stringify(data));
}

const signOut = (data) => {
    return axiosClient.post('/sign-out/');
}

const signUp = (data) => {
    return axiosClient.post('/sign-up/', JSON.stringify(data));
}

export default {
    signIn, signOut, signUp
}