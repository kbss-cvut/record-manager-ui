import {axiosBackend} from "./index";
import {Routes} from "../utils/Routes";
import {transitionTo, transitionToHome} from "../utils/Routing";
import * as ActionConstants from "../constants/ActionConstants";

export function login(username, password) {
    return function (dispatch) {
        dispatch(userAuthPending());
        axiosBackend.post('j_spring_security_check', `username=${username}&password=${password}`,
            {headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then((response) => {
            const data = response.data;
            if (!data.success || !data.loggedIn) {
                dispatch(userAuthError(response.data));
                return;
            }
            dispatch(userAuthSuccess(username));
            dispatch(loadUserProfile());
            transitionToHome();
        }).catch((error) => {
            dispatch(userAuthError(error.response.data));
        });
    }
}

export function userAuthPending() {
    return {
        type: ActionConstants.AUTH_USER_PENDING
    }
}

export function userAuthSuccess(username) {
    return {
        type: ActionConstants.AUTH_USER_SUCCESS,
        username
    }
}

export function userAuthError(error) {
    return {
        type: ActionConstants.AUTH_USER_ERROR,
        error
    }
}

export function logout() {
    //console.log("Logouting user");
    return function (dispatch) {
        axiosBackend.post('j_spring_security_logout').then(() => {
            dispatch(unauthUser());
            //Logger.log('User successfully logged out.');
        }).catch((error) => {
            //Logger.error('Logout failed. Status: ' + error.status);
        });
    }
}

export function unauthUser() {
    return {
        type: ActionConstants.UNAUTH_USER
    }
}

export function loadUserProfile() {
    //console.log("Loading user profile");
    return function (dispatch) {
        dispatch(loadUserProfilePending());
        axiosBackend.get('rest/users/current').then((response) => {
            dispatch(loadUserProfileSuccess(response.data));
        }).catch ((error) => {
            dispatch(loadUserProfileError(error.response.data));
        });
    }
}

export function loadUserProfilePending() {
    return {
        type: ActionConstants.LOAD_USER_PROFILE_PENDING
    }
}

export function loadUserProfileSuccess(user) {
    return {
        type: ActionConstants.LOAD_USER_PROFILE_SUCCESS,
        user
    }
}

export function loadUserProfileError(error) {
    return {
        type: ActionConstants.LOAD_USER_PROFILE_ERROR,
        error
    }
}

export function passwordReset(email) {
    return function (dispatch) {
        dispatch({type: ActionConstants.PASSWORD_RESET_PENDING});
        axiosBackend.post('rest/users/password-reset', email, {headers: {"Content-Type": "text/plain"}})
            .then(() => {
            dispatch({type: ActionConstants.PASSWORD_RESET_SUCCESS, email});
        }).catch ((error) => {
        });
    }
}

export function validateToken(token) {
    return function (dispatch) {
        dispatch({type: ActionConstants.VALIDATE_TOKEN_PENDING});
        axiosBackend.post('rest/users/validate-token', token, {headers: {"Content-Type": "text/plain"}})
            .then(() => {
                dispatch({type: ActionConstants.VALIDATE_TOKEN_SUCCESS});
            }).catch (() => {
                dispatch({type: ActionConstants.VALIDATE_TOKEN_ERROR});
        });
    }
}

export function changePasswordToken(password, token) {
    return function (dispatch) {
        dispatch({type: ActionConstants.PASSWORD_CHANGE_TOKEN_PENDING});
        axiosBackend.put('rest/users/password-change-token', {token, password}).then(() => {
            dispatch({type: ActionConstants.PASSWORD_CHANGE_TOKEN_SUCCESS});
        }).catch (() => {
            dispatch({type: ActionConstants.PASSWORD_CHANGE_TOKEN_ERROR});
        });
    }
}