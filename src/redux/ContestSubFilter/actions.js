import { SET_PARAMS, CLEAR_PARAMS } from './types';

export const setParams = (params) => {
    return {
        type: SET_PARAMS,
        params: {...params},
    };
};

export const clearParams = () => {
    return {
        type: CLEAR_PARAMS,
    };
};
