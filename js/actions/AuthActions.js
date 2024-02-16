import {axiosBackend} from "./index";
import {transitionToHome} from "../utils/Routing";
import * as ActionConstants from "../constants/ActionConstants";
import {API_URL} from '../../config';
import {IMPERSONATOR_TYPE} from "../constants/Vocabulary";
import {IMPERSONATE_LOGOUT_SUCCESS, IMPERSONATE_PENDING} from "../constants/ActionConstants";
import {MediaType} from "../constants/DefaultConstants";

export function login(username, password) {
    return function (dispatch) {
        dispatch(userAuthPending());
        axiosBackend.post(`${API_URL}/j_spring_security_check`, `username=${username}&password=${password}`,
            {
                headers: {'Content-Type': MediaType.FORM_URLENCODED}
            }).then((response) => {
            const data = response.data;
            if (!data.success || !data.loggedIn) {
                response.data.username = username;
                dispatch(userAuthError(response.data));
                return;
            }
            dispatch(userAuthSuccess(username));
            dispatch(loadUserProfile());
            try {
                transitionToHome();
            } catch (e) {/* caused test warning */
            }
        }).catch((error) => {
            dispatch(userAuthError(error?.response?.data));
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
    return function (dispatch, getState) {
        if (getState().auth.user.types.indexOf(IMPERSONATOR_TYPE) !== -1) {
            return logoutImpersonator(dispatch);
        }
        return axiosBackend.post(`${API_URL}/j_spring_security_logout`).then(() => {
            dispatch(unauthUser());
        }).catch((error) => {
            dispatch(userAuthError(error?.response?.data));
        });
    }
}

function logoutImpersonator(dispatch) {
    dispatch({type: IMPERSONATE_PENDING});
    return axiosBackend.post(`${API_URL}/rest/users/impersonate/logout`)
        .then(() => {
            dispatch({type: IMPERSONATE_LOGOUT_SUCCESS});
            transitionToHome();
            window.location.reload();
        })
        .catch((error) => {
            dispatch(userAuthError(error.response.data));
        });
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
        axiosBackend.get(`${API_URL}/rest/users/current`).then((response) => {
            dispatch(loadUserProfileSuccess(response.data));
        }).catch((error) => {
            dispatch(loadUserProfileError(error && error.response ? error.response.data : error));
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
        axiosBackend.post(`${API_URL}/rest/users/password-reset`, email, {headers: {"Content-Type": "text/plain"}})
            .then(() => {
                dispatch({type: ActionConstants.PASSWORD_RESET_SUCCESS, email});
            }).catch(() => {
            dispatch({type: ActionConstants.PASSWORD_RESET_ERROR});
        });
    }
}

export function validateToken(token) {
    return function (dispatch) {
        dispatch({type: ActionConstants.VALIDATE_TOKEN_PENDING});
        axiosBackend.post(`${API_URL}/rest/users/validate-token`, token, {headers: {"Content-Type": "text/plain"}})
            .then(() => {
                dispatch({type: ActionConstants.VALIDATE_TOKEN_SUCCESS});
            }).catch(() => {
            dispatch({type: ActionConstants.VALIDATE_TOKEN_ERROR});
        });
    }
}

export function changePasswordToken(password, token) {
    return function (dispatch) {
        dispatch({type: ActionConstants.PASSWORD_CHANGE_TOKEN_PENDING});
        axiosBackend.put(`${API_URL}/rest/users/password-change-token`, {token, password}).then(() => {
            dispatch({type: ActionConstants.PASSWORD_CHANGE_TOKEN_SUCCESS});
        }).catch(() => {
            dispatch({type: ActionConstants.PASSWORD_CHANGE_TOKEN_ERROR});
        });
    }
}