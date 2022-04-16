import axiosClient from "api/axiosClient";

function signIn(data){
    console.log("Signing In with data:", data);
    return axiosClient.post('/sign-in/', JSON.stringify(data));
}

function signOut(data){
    return axiosClient.post('/sign-out/');
}

function signUp(data){
    return axiosClient.post('/sign-up/', JSON.stringify(data));
}

export default {
    signIn, signOut, signUp
}