import { combineReducers } from 'redux';
import counterReducer from './Counter/reducer.js';

const rootReducer = combineReducers({
    counter: counterReducer,
});

export default rootReducer;