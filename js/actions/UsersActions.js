import * as ActionConstants from "../constants/ActionConstants";
import {axiosBackend} from "./index";

export function loadUsers() {
    return function (dispatch) {
        dispatch(loadUsersPending());
        axiosBackend.get('rest/users').then((response) => {
            dispatch(loadUsersSuccess(response.data));
        }).catch((error) => {
            dispatch(loadUsersError(error.response.data));
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
