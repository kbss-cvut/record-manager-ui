import * as ActionConstants from "../constants/ActionConstants";
import {axiosBackend} from "./index";
import {API_URL} from '../../config';
import {showServerResponseErrorMessage} from "./AsyncActionUtils";

export function loadUsers() {
    return function (dispatch) {
        dispatch(loadUsersPending());
        return axiosBackend.get(`${API_URL}/rest/users`).then((response) => {
            dispatch(loadUsersSuccess(response.data));
        }).catch((error) => {
            dispatch(loadUsersError(error.response.data));
            dispatch(showServerResponseErrorMessage(error, 'users.loading-error'));
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
