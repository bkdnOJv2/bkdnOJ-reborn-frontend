import { UPDATE, CLEAR } from './types';


export const updateContest = ({ contest }) => {
    return {
        type: UPDATE,
        virtual: contest.virtual,
        ...contest,
    };
};

export const clearContest = () => {
    return {
        type: CLEAR,
    };
};