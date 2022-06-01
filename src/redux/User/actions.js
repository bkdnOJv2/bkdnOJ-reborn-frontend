import { UPDATE, UPDATE_PROFILE, CLEAR } from './types';

export const updateProfile = (profile) => {
    return {
        type: UPDATE_PROFILE,
        profile,
    };
};

export const updateUser = (user) => {
    return {
        type: UPDATE,
        user,
    };
};

export const clearUser = () => {
    return {
        type: CLEAR,
    };
};