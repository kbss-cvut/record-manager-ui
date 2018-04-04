import {axiosBackend} from "./index";
import * as ActionConstants from "../constants/ActionConstants";
import {omit, startsWith, endsWith} from 'lodash';
import {ROLE} from "../constants/DefaultConstants";

const URL_PREFIX = 'rest/action-history';

export function logAction(action, author, timestamp) {
    if (!startsWith(action.type, 'LOAD') && !endsWith(action.type, 'PENDING') && !startsWith(action.type, 'SET') && !startsWith(action.type, 'UNLOAD')) {
        const payload = JSON.stringify(omit(action, 'type'));
        axiosBackend.post(URL_PREFIX, {author, timestamp, type: action.type, payload: payload !== '{}' ? payload : null});
    }
}

export function loadActions(authorUsername = null, actionType = null, pageNumber) {
    const page = `?page=${pageNumber}`;
    let urlSuffix = '';
    if (authorUsername){
        urlSuffix = `${page}&author=${authorUsername}`;
    } else if (actionType) {
        urlSuffix = `${page}&type=${actionType}`;
    } else {
        urlSuffix = page;
    }
    return function (dispatch) {
        dispatch({type: ActionConstants.LOAD_ACTIONS_HISTORY_PENDING});
        axiosBackend.get(`rest/action-history${urlSuffix}`).then((response) => {
            dispatch({type: ActionConstants.LOAD_ACTIONS_HISTORY_SUCCESS, actionsHistory: response.data});
        }).catch((error) => {
            dispatch({type: ActionConstants.LOAD_ACTIONS_HISTORY_ERROR, error: error.response.data});
        });
    }
}

export function loadActionByKey(key) {
    return function (dispatch) {
        dispatch({type: ActionConstants.LOAD_ACTION_HISTORY_PENDING});
        axiosBackend.get(`rest/action-history/${key}`).then((response) => {
            dispatch({type: ActionConstants.LOAD_ACTION_HISTORY_SUCCESS, actionHistory: response.data});
        }).catch((error) => {
            dispatch({type: ActionConstants.LOAD_ACTION_HISTORY_ERROR, error: error.response.data});
        });
    }
}