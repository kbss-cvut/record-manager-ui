import {logAction} from "../actions/HistoryActions";

export const historyLogger = store => next => action => {
    if (store.getState().auth.isLoaded) {
        logAction(action, store.getState().auth.user, Date.now());
    }
    return next(action)
};