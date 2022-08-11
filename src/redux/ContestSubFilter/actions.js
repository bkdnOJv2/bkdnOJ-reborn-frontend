import { SET_PARAMS, CLEAR_PARAMS } from './types';

export const setParams = () => {
    return {
        type: SET_PARAMS,
    };
};

export const clearParams = () => {
    return {
        type: CLEAR_PARAMS,
    };
};
