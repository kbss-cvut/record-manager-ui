import {ACTION_FLAG, ROLE} from "../constants/DefaultConstants";
import { axiosBackend} from "./index";
import * as ActionConstants from "../constants/ActionConstants";
import {loadUsers} from "./UsersActions";
import {API_URL} from '../../config';

export function createUser(user) {
    //console.log("Creating user: ", user);
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
    //console.log("Updating user: ", user);
    return function (dispatch) {
        dispatch(saveUserPending(ACTION_FLAG.UPDATE_ENTITY));
        axiosBackend.put(`${API_URL}/rest/users/${user.username}${!sendEmail ? '?email=false' : ''}`, {
            ...user
        }).then(() => {
            dispatch(saveUserSuccess(user, ACTION_FLAG.UPDATE_ENTITY));
            if (currentUser.role === ROLE.ADMIN){
                dispatch(loadUsers());
            }
        }).catch((error) => {
            dispatch(saveUserError(error.response.data, user, ACTION_FLAG.UPDATE_ENTITY));
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
    //console.log("Deleting user: ", user);
    return function (dispatch) {
        dispatch(deleteUserPending(user.username));
        axiosBackend.delete(`${API_URL}/rest/users/${user.username}`, {
            ...user
        }).then(() => {
            if (institution){
                dispatch(loadInstitutionMembers(institution.key))
            } else {
                dispatch(loadUsers());
            }
            dispatch(deleteUserSuccess(user));
        }).catch((error) => {
            dispatch(deleteUserError(error.response.data, user));
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
        axiosBackend.get(`${API_URL}/rest/users/${username}`).then((response) => {
            dispatch(loadUserSuccess(response.data));
        }).catch((error) => {
            dispatch(loadUserError(error.response.data));
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
        axiosBackend.get(`${API_URL}/rest/users?institution=${key}`).then((response) => {
            dispatch(loadInstitutionMembersSuccess(response.data));
        }).catch((error) => {
            dispatch(loadInstitutionMembersError(error.response.data));
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
    return function (dispatch) {
        dispatch(changePasswordPending());
        axiosBackend.put(`${API_URL}/rest/users/${username}/password-change${!sendEmail ? '?email=false' : ''}`, {
            ...password
        }).then(() => {
            dispatch(changePasswordSuccess());
        }).catch((error) => {
            dispatch(changePasswordError(error.response.data));
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
        }).catch((error) => {
            dispatch({type: ActionConstants.SEND_INVITATION_ERROR, error: error.response.data});
            dispatch(loadUser(username));
        });
    }
}

export function deleteInvitationOption(username) {
    return function (dispatch) {
        dispatch({type: ActionConstants.INVITATION_OPTION_DELETE_PENDING, username});
        axiosBackend.post(`${API_URL}/rest/users/send-invitation/delete`, username, {headers: {"Content-Type": "text/plain"}}).then(() => {
            dispatch({type: ActionConstants.INVITATION_OPTION_DELETE_SUCCESS, username});
            dispatch(loadUser(username));
        }).catch((error) => {
            dispatch({type: ActionConstants.INVITATION_OPTION_DELETE_ERROR, error: error.response.data});
            dispatch(loadUser(username));
        });
    }
}

export function impersonate(username) {
    return function (dispatch) {
        dispatch({type: ActionConstants.IMPERSONATE_PENDING});
        axiosBackend.post(`${API_URL}/rest/users/impersonate`, username, {headers: {"Content-Type": "text/plain"}}).then(() => {
            dispatch({type: ActionConstants.IMPERSONATE_SUCCESS, username});
            window.location.reload();
        }).catch ((error) => {
            dispatch({type: ActionConstants.IMPERSONATE_ERROR, error: error.response.data});
        });
    }
}