import { UPDATE, CLEAR, UPDATE_PROFILE } from './types';
import { __ls_remove_credentials } from 'helpers/localStorageHelpers';

const INITIAL_STATE = {
    user: { user: null, },
    profile: { profile: null },
};

const reducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case UPDATE_PROFILE:
            return {
                ...state, 
                profile: action.profile,
            };
        case UPDATE:
            return {
                ...state, 
                user: action.user,
            };
        case CLEAR:
            __ls_remove_credentials();
            return {
                ...state, 
                user: { user: null, },
                profile: { profile: null },
            };
        default: 
            return state;
    }
};

export default reducer;