import {ACTION_FLAG, MediaType} from "../constants/DefaultConstants";
import {axiosBackend} from "./index";
import * as ActionConstants from "../constants/ActionConstants";
import {loadUsers} from "./UsersActions";
import {API_URL, getEnv} from '../../config';
import {transitionToHome} from "../utils/Routing";
import {getOidcToken, isAdmin, saveOidcToken} from "../utils/SecurityUtils";
import {publishMessage} from "./MessageActions";
import {errorMessage, successMessage} from "../model/Message";
import {showServerResponseErrorMessage} from "./AsyncActionUtils";

export function createUser(user) {
    return function (dispatch) {
        dispatch(saveUserPending(ACTION_FLAG.CREATE_ENTITY));
        axiosBackend.post(`${API_URL}/rest/users`, {
            ...user
        }).then(() => {
            dispatch(saveUserSuccess(user, ACTION_FLAG.CREATE_ENTITY));
            dispatch(loadUsers());
        }).catch((error) => {
            dispatch(saveUserError(error.response.data, user, ACTION_FLAG.CREATE_ENTITY));
        });
    }
}

export function updateUser(user, currentUser, sendEmail = true) {
    return function (dispatch) {
        dispatch(saveUserPending(ACTION_FLAG.UPDATE_ENTITY));
        axiosBackend.put(`${API_URL}/rest/users/${user.username}${!sendEmail ? '?email=false' : ''}`, {
            ...user
        }).then(() => {
            dispatch(saveUserSuccess(user, ACTION_FLAG.UPDATE_ENTITY));
            if (isAdmin(currentUser)) {
                dispatch(loadUsers());
            }
            dispatch(publishMessage(successMessage(sendEmail ? 'user.save-success-with-email' : 'user.save-success')));
        }).catch((error) => {
            dispatch(saveUserError(error.response.data, user, ACTION_FLAG.UPDATE_ENTITY));
            dispatch(showServerResponseErrorMessage(error, 'user.save-error'));
        });
    }
}

export function saveUserPending(actionFlag) {
    return {
        type: ActionConstants.SAVE_USER_PENDING,
        actionFlag
    }
}

export function saveUserSuccess(user, actionFlag) {
    return {
        type: ActionConstants.SAVE_USER_SUCCESS,
        user,
        actionFlag
    }
}

export function saveUserError(error, user, actionFlag) {
    return {
        type: ActionConstants.SAVE_USER_ERROR,
        error,
        user,
        actionFlag
    }
}

export function unloadSavedUser() {
    return {
        type: ActionConstants.UNLOAD_SAVED_USER
    }
}

export function deleteUser(user, institution = null) {
    return function (dispatch) {
        dispatch(deleteUserPending(user.username));
        return axiosBackend.delete(`${API_URL}/rest/users/${user.username}`, {
            ...user
        }).then(() => {
            if (institution) {
                dispatch(loadInstitutionMembers(institution.key))
            } else {
                dispatch(loadUsers());
            }
            dispatch(deleteUserSuccess(user));
            dispatch(publishMessage(successMessage("user.delete-success")));
        }).catch((error) => {
            dispatch(deleteUserError(error.response.data, user));
            dispatch(showServerResponseErrorMessage(error, "user.delete-error"));
        });
    }
}

export function deleteUserPending(username) {
    return {
        type: ActionConstants.DELETE_USER_PENDING,
        username
    }
}

export function deleteUserSuccess(user) {
    return {
        type: ActionConstants.DELETE_USER_SUCCESS,
        user
    }
}

export function deleteUserError(error, user) {
    return {
        type: ActionConstants.DELETE_USER_ERROR,
        error,
        user,
    }
}

export function loadUser(username) {
    //console.log("Loading user with username: ", username);
    return function (dispatch) {
        dispatch(loadUserPending());
        return axiosBackend.get(`${API_URL}/rest/users/${username}`).then((response) => {
            dispatch(loadUserSuccess(response.data));
        }).catch((error) => {
            dispatch(loadUserError(error.response.data));
            dispatch(showServerResponseErrorMessage(error, 'user.load-error'));
        });
    }
}

export function loadUserPending() {
    return {
        type: ActionConstants.LOAD_USER_PENDING
    }
}

export function loadUserSuccess(user) {
    return {
        type: ActionConstants.LOAD_USER_SUCCESS,
        user
    }
}

export function loadUserError(error) {
    return {
        type: ActionConstants.LOAD_USER_ERROR,
        error
    }
}

export function unloadUser() {
    return {
        type: ActionConstants.UNLOAD_USER
    }
}

export function loadInstitutionMembers(key) {
    //console.log("Loading members of institution", key);
    return function (dispatch) {
        dispatch(loadInstitutionMembersPending());
        return axiosBackend.get(`${API_URL}/rest/users?institution=${key}`).then((response) => {
            dispatch(loadInstitutionMembersSuccess(response.data));
        }).catch((error) => {
            dispatch(loadInstitutionMembersError(error.response.data));
            dispatch(showServerResponseErrorMessage(error, 'institution.members.loading-error'));
        });
    }
}

export function loadInstitutionMembersPending() {
    return {
        type: ActionConstants.LOAD_INSTITUTION_MEMBERS_PENDING
    }
}

export function loadInstitutionMembersSuccess(members) {
    return {
        type: ActionConstants.LOAD_INSTITUTION_MEMBERS_SUCCESS,
        members
    }
}

export function loadInstitutionMembersError(error) {
    return {
        type: ActionConstants.LOAD_INSTITUTION_MEMBERS_ERROR,
        error
    }
}

export function unloadInstitutionMembers() {
    return {
        type: ActionConstants.UNLOAD_INSTITUTION_MEMBERS,
    }
}

export function changePassword(username, password, sendEmail = true) {
    return function (dispatch, getState) {
        dispatch(changePasswordPending());
        axiosBackend.put(`${API_URL}/rest/users/${username}/password-change${!sendEmail ? '?email=false' : ''}`, {
            ...password
        }).then(() => {
            dispatch(changePasswordSuccess());
            dispatch(publishMessage(successMessage(sendEmail ? 'user.password-change-success-with-email' : 'user.password-change-success')));
        }).catch((error) => {
            dispatch(changePasswordError(error.response.data));
            dispatch(publishMessage(errorMessage('user.password-change-error', {error: getState().intl.messages[error.response.data.messageId]})));
        });
    }
}

export function changePasswordPending() {
    return {
        type: ActionConstants.PASSWORD_CHANGE_PENDING
    }
}

export function changePasswordSuccess() {
    return {
        type: ActionConstants.PASSWORD_CHANGE_SUCCESS,
    }
}

export function changePasswordError(error) {
    return {
        type: ActionConstants.PASSWORD_CHANGE_ERROR,
        error
    }
}

export function generateUsername(usernamePrefix) {
    return function (dispatch) {
        dispatch({type: ActionConstants.GENERATE_USERNAME_PENDING});
        axiosBackend.get(`${API_URL}/rest/users/generate-username/${usernamePrefix}`).then((response) => {
            dispatch({type: ActionConstants.GENERATE_USERNAME_SUCCESS, generatedUsername: response.data});
        })
    }
}

export function sendInvitation(username) {
    return function (dispatch) {
        dispatch({type: ActionConstants.SEND_INVITATION_PENDING, username});
        axiosBackend.put(`${API_URL}/rest/users/send-invitation/${username}`).then(() => {
            dispatch({type: ActionConstants.SEND_INVITATION_SUCCESS, username});
            dispatch(loadUser(username));
            dispatch(publishMessage(successMessage("user.send-invitation-success")));
        }).catch((error) => {
            dispatch({type: ActionConstants.SEND_INVITATION_ERROR, error: error.response.data});
            dispatch(loadUser(username));
            dispatch(showServerResponseErrorMessage(error, 'user.send-invitation-error'));
        });
    }
}

export function deleteInvitationOption(username) {
    return function (dispatch) {
        dispatch({type: ActionConstants.INVITATION_OPTION_DELETE_PENDING, username});
        axiosBackend.post(`${API_URL}/rest/users/send-invitation/delete`, username, {headers: {"Content-Type": "text/plain"}}).then(() => {
            dispatch({type: ActionConstants.INVITATION_OPTION_DELETE_SUCCESS, username});
            dispatch(loadUser(username));
            dispatch(publishMessage(successMessage("user.delete-invitation-option-success")));
        }).catch((error) => {
            dispatch({type: ActionConstants.INVITATION_OPTION_DELETE_ERROR, error: error.response.data});
            dispatch(loadUser(username));
            dispatch(showServerResponseErrorMessage(error, 'user.delete-invitation-option-error'));
        });
    }
}

export function impersonate(username) {
    return function (dispatch) {
        dispatch({type: ActionConstants.IMPERSONATE_PENDING});
        axiosBackend.post(`${API_URL}/rest/users/impersonate`, `username=${username}`, {
            headers: {'Content-Type': MediaType.FORM_URLENCODED}
        }).then(() => {
            dispatch({type: ActionConstants.IMPERSONATE_SUCCESS, username});
            transitionToHome();
            window.location.reload();
        }).catch((error) => {
            dispatch({type: ActionConstants.IMPERSONATE_ERROR, error: error.response.data});
            dispatch(showServerResponseErrorMessage(error, 'user.impersonate-error'));
        });
    }
}

export function oidcImpersonate(username) {
    return function (dispatch) {
        dispatch({type: ActionConstants.IMPERSONATE_PENDING});
        axiosBackend.post(`${getEnv("AUTH_SERVER_URL")}/protocol/openid-connect/token`, new URLSearchParams({
            client_id: getEnv("AUTH_CLIENT_ID"),
            grant_type: "urn:ietf:params:oauth:grant-type:token-exchange",
            requested_subject: username,
            subject_token: getOidcToken().access_token
        }), {
            headers: {'Content-Type': MediaType.FORM_URLENCODED}
        }).then((resp) => {
            dispatch({type: ActionConstants.IMPERSONATE_SUCCESS, username});
            // Store the current user (impersonator)'s id token for later logout
            const impersonatorIdToken = getOidcToken().id_token;
            const impersonatorData = Object.assign({}, resp.data, {impersonatorIdToken: impersonatorIdToken});
            saveOidcToken(impersonatorData);
            transitionToHome();
            window.location.reload();
        }).catch((error) => {
            dispatch({type: ActionConstants.IMPERSONATE_ERROR, error: error.response.data});
        });
    }
}