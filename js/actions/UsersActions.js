import * as ActionConstants from "../constants/ActionConstants";
import {axiosBackend} from "./index";
import {API_URL} from '../../config';
import {publishMessage} from "./MessageActions";
import {errorMessage} from "../model/Message";

export function loadUsers() {
    return function (dispatch) {
        dispatch(loadUsersPending());
        return axiosBackend.get(`${API_URL}/rest/users`).then((response) => {
            dispatch(loadUsersSuccess(response.data));
        }).catch((error) => {
            dispatch(loadUsersError(error.response.data));
            dispatch(publishMessage(errorMessage('users.loading-error', {error: error.response.data.message})));
        });
    }
}

export function loadUsersPending() {
    return {
        type: ActionConstants.LOAD_USERS_PENDING
    }
}

export function loadUsersSuccess(users) {
    return {
        type: ActionConstants.LOAD_USERS_SUCCESS,
        users
    }
}

export function loadUsersError(error) {
    return {
        type: ActionConstants.LOAD_USERS_ERROR,
        error
    }
}
