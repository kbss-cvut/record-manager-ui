import {axiosBackend} from "./index";
import * as ActionConstants from "../constants/ActionConstants";
import {omit, startsWith, endsWith} from 'lodash';

const URL_PREFIX = 'rest/action-history';

export function logAction(action, author, timestamp) {
    if (!startsWith(action.type, 'LOAD') && !endsWith(action.type, 'PENDING') && !startsWith(action.type, 'SET') && !startsWith(action.type, 'UNLOAD')) {
        const payload = JSON.stringify(omit(action, 'type'));
        axiosBackend.post(URL_PREFIX, {author, timestamp, type: action.type, payload});
    }
}

export function loadActions() {
    return function (dispatch) {
        dispatch({type: ActionConstants.LOAD_ACTIONS_HISTORY_PENDING});
        axiosBackend.get('rest/action-history').then((response) => {
            dispatch({type: ActionConstants.LOAD_ACTIONS_HISTORY_SUCCESS, actionsHistory: response.data});
        }).catch((error) => {
            console.log(error);
            dispatch({type: ActionConstants.LOAD_ACTIONS_HISTORY_ERROR, error: error.response.data});
        });
    }
}
