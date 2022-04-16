import { UPDATE, CLEAR } from './types';

const INITIAL_STATE = {
    user: null,
};

const reducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case UPDATE:
            return {
                ...state, 
                user: action.user,
            };
        case CLEAR:
            return {
                ...state, 
                user: null,
            };
        default: return state;
    }
};

export default reducer;