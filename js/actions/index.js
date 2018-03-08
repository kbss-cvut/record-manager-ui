import * as ActionConstants from "../constants/ActionConstants";
import {ACTION_FLAG} from "../constants/DefaultConstants";
import axios from 'axios';
import * as Routing from "../utils/Routing";
import * as Routes from "../utils/Routes";
import * as Utils from "../utils/Utils";

// Axios instance for communicating with Backend
export let axiosBackend = axios.create();

axiosBackend.interceptors.response.use(
    response => response,
    error => {
        const {status} = error.response;
        if (status === 401) {
            Routing.transitionTo(Routes.login);
        }
        return Promise.reject(error);
    }
);

export function login(username, password) {
    return function (dispatch) {
        axiosBackend.post('j_spring_security_check', `username=${username}&password=${password}`,
            {headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then((response) => {
            const data = response.data;
            if (!data.success || !data.loggedIn) {
                dispatch(userAuthError(response.data));
                return;
            }
            dispatch(userAuthSuccess());
            dispatch(loadUserProfile());
            /*This makes test warning*/
            Routing.transitionToOriginalTarget();
        }).catch((error) => {
            dispatch(userAuthError(error.response.data));
        });
    }
}

export function userAuthSuccess() {
    return {
        type: ActionConstants.AUTH_USER
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
            Routing.transitionTo(Routes.login);
            window.location.reload();
        }).catch((error) => {
            /* TODO maybe action error */
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

export function createUser(user) {
    //console.log("Creating user: ", user);
    return function (dispatch) {
        dispatch(saveUserPending(ACTION_FLAG.CREATE_ENTITY));
        axiosBackend.post('rest/users', {
            ...user
        }).then(() => {
            dispatch(saveUserSuccess(user, ACTION_FLAG.CREATE_ENTITY));
            dispatch(loadUsers());
        }).catch ((error) => {
            dispatch(saveUserError(error.response.data, user, ACTION_FLAG.CREATE_ENTITY));
        });
    }
}

export function updateUser(user) {
    //console.log("Updating user: ", user);
    return function (dispatch) {
        dispatch(saveUserPending(ACTION_FLAG.UPDATE_ENTITY));
        axiosBackend.put(`rest/users/${user.username}`, {
            ...user
        }).then(() => {
            dispatch(saveUserSuccess(user, ACTION_FLAG.UPDATE_ENTITY));
            dispatch(loadUsers());
        }).catch ((error) => {
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

export function deleteUser(user) {
    //console.log("Deleting user: ", user);
    return function (dispatch) {
        dispatch(deleteUserPending(user.username));
        axiosBackend.delete(`rest/users/${user.username}`, {
            ...user
        }).then(() => {
            dispatch(loadUsers());
            dispatch(deleteUserSuccess(user));
        }).catch ((error) => {
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
        axiosBackend.get(`rest/users/${username}`).then((response) => {
            dispatch(loadUserSuccess(response.data));
        }).catch ((error) => {
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

export function loadUsers() {
    //console.log("Loading all users");
    return function (dispatch) {
        dispatch(loadUsersPending());
        axiosBackend.get('rest/users').then((response) => {
            dispatch(loadUsersSuccess(response.data));
        }).catch ((error) => {
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

export function loadInstitutions() {
    //console.log("Loading all institutions");
    return function (dispatch) {
        dispatch(loadInstitutionsPending());
        axiosBackend.get('rest/institutions').then((response) => {
            dispatch(loadInstitutionsSuccess(response.data));
        }).catch ((error) => {
            dispatch(loadInstitutionsError(error.response.data));
        });
    }
}

export function loadInstitutionsPending() {
    return {
        type: ActionConstants.LOAD_INSTITUTIONS_PENDING
    }
}

export function loadInstitutionsSuccess(institutions) {
    return {
        type: ActionConstants.LOAD_INSTITUTIONS_SUCCESS,
        institutions
    }
}

export function loadInstitutionsError(error) {
    return {
        type: ActionConstants.LOAD_INSTITUTIONS_ERROR,
        error
    }
}

export function deleteInstitution(institution) {
    //console.log("Deleting institution: ", institution);
    return function (dispatch) {
        dispatch(deleteInstitutionPending(institution.key));
        axiosBackend.delete(`rest/institutions/${institution.key}`, {
            ...institution
        }).then(() => {
            dispatch(loadInstitutions());
            dispatch(deleteInstitutionSuccess(institution));
        }).catch ((error) => {
            dispatch(deleteInstitutionError(error.response.data, institution));
        });
    }
}

export function deleteInstitutionPending(key) {
    return {
        type: ActionConstants.DELETE_INSTITUTION_PENDING,
        key
    }
}

export function deleteInstitutionSuccess(institution) {
    return {
        type: ActionConstants.DELETE_INSTITUTION_SUCCESS,
        institution
    }
}

export function deleteInstitutionError(error, institution) {
    return {
        type: ActionConstants.DELETE_INSTITUTION_ERROR,
        error,
        institution,
    }
}

export function loadInstitution(key) {
    //console.log("Loading institution with username: ", username);
    return function (dispatch) {
        dispatch(loadInstitutionPending());
        axiosBackend.get(`rest/institutions/${key}`).then((response) => {
            dispatch(loadInstitutionSuccess(response.data));
        }).catch ((error) => {
            dispatch(loadInstitutionError(error.response.data));
        });
    }
}

export function loadInstitutionPending() {
    return {
        type: ActionConstants.LOAD_INSTITUTION_PENDING
    }
}

export function loadInstitutionSuccess(institution) {
    return {
        type: ActionConstants.LOAD_INSTITUTION_SUCCESS,
        institution
    }
}

export function loadInstitutionError(error) {
    return {
        type: ActionConstants.LOAD_INSTITUTION_ERROR,
        error
    }
}

export function unloadInstitution() {
    return {
        type: ActionConstants.UNLOAD_INSTITUTION
    }
}

export function createInstitution(institution) {
    //console.log("Creating institution: ", institution);
    return function (dispatch) {
        dispatch(saveInstitutionPending(ACTION_FLAG.CREATE_ENTITY));
        axiosBackend.post('rest/institutions', {
            ...institution
        }).then((response) => {
            const key = Utils.extractKeyFromLocationHeader(response);
            dispatch(saveInstitutionSuccess(institution, key, ACTION_FLAG.CREATE_ENTITY));
            dispatch(loadInstitutions());
        }).catch ((error) => {
            dispatch(saveInstitutionError(error.response.data, institution, ACTION_FLAG.CREATE_ENTITY));
        });
    }
}

export function updateInstitution(institution) {
    //console.log("Updating institution: ", institution);
    return function (dispatch) {
        dispatch(saveInstitutionPending(ACTION_FLAG.UPDATE_ENTITY));
        axiosBackend.put(`rest/institutions/${institution.key}`, {
            ...institution
        }).then((response) => {
            dispatch(saveInstitutionSuccess(institution, null, ACTION_FLAG.UPDATE_ENTITY));
            //dispatch(loadInstitutions());
        }).catch ((error) => {
            dispatch(saveInstitutionError(error.response.data, institution, ACTION_FLAG.UPDATE_ENTITY));
        });
    }
}

export function saveInstitutionPending(actionFlag) {
    return {
        type: ActionConstants.SAVE_INSTITUTION_PENDING,
        actionFlag
    }
}

export function saveInstitutionSuccess(institution, key, actionFlag) {
    return {
        type: ActionConstants.SAVE_INSTITUTION_SUCCESS,
        institution,
        key,
        actionFlag
    }
}

export function saveInstitutionError(error, institution, actionFlag) {
    return {
        type: ActionConstants.SAVE_INSTITUTION_ERROR,
        error,
        institution,
        actionFlag
    }
}

export function loadInstitutionMembers(key) {
    //console.log("Loading members of institution", key);
    return function (dispatch) {
        dispatch(loadInstitutionMembersPending());
        axiosBackend.get(`rest/users?institution=${key}`).then((response) => {
            dispatch(loadInstitutionMembersSuccess(response.data));
        }).catch ((error) => {
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

export function loadInstitutionPatients(key) {
    //console.log("Loading patients of institution", key);
    return function (dispatch) {
        dispatch(loadInstitutionPatientsPending());
        axiosBackend.get(`rest/records?institution=${key}`).then((response) => {
            dispatch(loadInstitutionPatientsSuccess(response.data));
        }).catch ((error) => {
            dispatch(loadInstitutionPatientsError(error.response.data));
        });
    }
}

export function loadInstitutionPatientsPending() {
    return {
        type: ActionConstants.LOAD_INSTITUTION_PATIENTS_PENDING
    }
}

export function loadInstitutionPatientsSuccess(patients) {
    return {
        type: ActionConstants.LOAD_INSTITUTION_PATIENTS_SUCCESS,
        patients
    }
}

export function loadInstitutionPatientsError(error) {
    return {
        type: ActionConstants.LOAD_INSTITUTION_PATIENTS_ERROR,
        error
    }
}