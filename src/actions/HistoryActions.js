import {axiosBackend} from "./index";
import * as ActionConstants from "../constants/ActionConstants";
import {endsWith, omit, startsWith} from 'lodash';
import {API_URL} from '../../config';
import {showServerResponseErrorMessage} from "./AsyncActionUtils";
import {DEFAULT_PAGE_SIZE, STORAGE_TABLE_PAGE_SIZE_KEY} from "../constants/DefaultConstants";
import BrowserStorage from "../utils/BrowserStorage";

const URL_PREFIX = 'rest/history';

export function logAction(action, author, timestamp) {
    if ((startsWith(action.type, 'LOAD') && !endsWith(action.type, 'ERROR')) ||
        endsWith(action.type, 'PENDING') ||
        startsWith(action.type, 'SET') ||
        startsWith(action.type, 'UNLOAD') ||
        action.type.includes('USER_PROFILE')) {
        return;
    }
    const payload = JSON.stringify(omit(action, 'type'));
    axiosBackend.post(`${API_URL}/${URL_PREFIX}`, {
        author,
        timestamp,
        type: action.type,
        payload: payload !== '{}' ? payload : null
    });
}

export function loadActions(pageNumber, searchData) {
    let urlSuffix = `?page=${pageNumber}&size=${BrowserStorage.get(STORAGE_TABLE_PAGE_SIZE_KEY, DEFAULT_PAGE_SIZE)}`;
    if (searchData && searchData.author && searchData.action) {
        urlSuffix = `${urlSuffix}&author=${searchData.author}&type=${searchData.action}`;
    } else if (searchData && searchData.author) {
        urlSuffix = `${urlSuffix}&author=${searchData.author}`;
    } else if (searchData && searchData.action) {
        urlSuffix = `${urlSuffix}&type=${searchData.action}`;
    }
    return function (dispatch) {
        dispatch({type: ActionConstants.LOAD_ACTIONS_HISTORY_PENDING});
        return axiosBackend.get(`${API_URL}/${URL_PREFIX}${urlSuffix}`).then((response) => {
            dispatch({type: ActionConstants.LOAD_ACTIONS_HISTORY_SUCCESS, actionsHistory: response.data});
        }).catch((error) => {
            dispatch({type: ActionConstants.LOAD_ACTIONS_HISTORY_ERROR, error: error.response.data});
            dispatch(showServerResponseErrorMessage(error, 'history.loading-error'));
        });
    }
}

export function loadActionByKey(key) {
    return function (dispatch) {
        dispatch({type: ActionConstants.LOAD_ACTION_HISTORY_PENDING});
        return axiosBackend.get(`${API_URL}/${URL_PREFIX}/${key}`).then((response) => {
            dispatch({type: ActionConstants.LOAD_ACTION_HISTORY_SUCCESS, actionHistory: response.data});
        }).catch((error) => {
            dispatch({type: ActionConstants.LOAD_ACTION_HISTORY_ERROR, error: error.response.data});
            dispatch(showServerResponseErrorMessage(error, 'history.load-error'));
        });
    }
}