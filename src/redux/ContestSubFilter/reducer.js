import { SET_PARAMS, CLEAR_PARAMS } from './types';

const INITIAL_STATE = {};

const reducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SET_PARAMS:
            return {
                ...state, ...action.params
            };
        case CLEAR_PARAMS:
            return {};
        default:
            return state;
    }
};

export default reducer;
