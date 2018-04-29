import {logAction} from "../actions/HistoryActions";
import {SCRIPT_ERROR} from "../constants/DefaultConstants";

export const historyLogger = store => next => action => {
    if (store.getState().auth.isLoaded) {
        logAction(action, store.getState().auth.user, Date.now());
    } else {
        logAction(action, null, Date.now());
    }
    return next(action)
};

export function errorLogger(message, line, store) {
    const height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    const error = {
        type: SCRIPT_ERROR,
        message,
        line,
        url: window.location.href,
        viewport: `${width}x${height}`,
        userAgent: window.navigator.userAgent
    };
    if (store.getState().auth.isLoaded) {
        logAction(error, store.getState().auth.user, Date.now());
    } else {
        logAction(error, null, Date.now());
    }
}