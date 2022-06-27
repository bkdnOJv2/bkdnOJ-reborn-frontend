import { combineReducers } from 'redux';
import counterReducer from './Counter/reducer.js';

import userReducer from './User/reducer.js';
import profileReducer from './Profile/reducer.js';
import contestReducer from './Contest/reducer';

import recentSubmissionReducer from './RecentSubmission/reducer';
import ranksReducer from './Rank/reducer';

const rootReducer = combineReducers({
    counter: counterReducer,
    user: userReducer,
    profile: profileReducer,
    contest: contestReducer,
    recentSubmission: recentSubmissionReducer,
    ranks: ranksReducer,
});

export default rootReducer;
