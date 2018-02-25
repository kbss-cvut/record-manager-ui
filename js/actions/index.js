import * as ActionConstants from "../constants/ActionConstants";
import {ACTION_TYPE} from "../constants/DefaultConstants";
import axios from 'axios';

export function createUser(user) {
    //console.log("Creating user: ", user);
    return function (dispatch) {
        dispatch(saveUserBegin(ACTION_TYPE.CREATE_USER));
        axios.post('rest/users', {
            ...user
        }).then(() => {
            dispatch(saveUserComplete(user, ACTION_TYPE.CREATE_USER));
            dispatch(loadUsers());
        }).catch ((error) => {
            dispatch(saveUserError(error.response.data, user, ACTION_TYPE.CREATE_USER));
        });
    }
}

export function updateUser(user) {
    //console.log("Updating user: ", user);
    return function (dispatch) {
        dispatch(saveUserBegin(ACTION_TYPE.UPDATE_USER));
        axios.put(`rest/users/${user.username}`, {
            ...user
        }).then(() => {
            dispatch(saveUserComplete(user, ACTION_TYPE.UPDATE_USER));
            dispatch(loadUsers());
        }).catch ((error) => {
            dispatch(saveUserError(error.response.data, user, ACTION_TYPE.UPDATE_USER));
        });
    }
}

export function saveUserBegin(actionType) {
    return {
        type: ActionConstants.SAVE_USER_BEGIN,
        actionType
    }
}

export function saveUserComplete(user, actionType) {
    return {
        type: ActionConstants.SAVE_USER_COMPLETE,
        user,
        actionType
    }
}

export function saveUserError(error, user, actionType) {
    return {
        type: ActionConstants.SAVE_USER_ERROR,
        error,
        user,
        actionType
    }
}

export function deleteUser(user) {
    //console.log("Deleting user: ", user);
    return function (dispatch) {
        dispatch(deleteUserBegin(user.username));
        axios.delete(`rest/users/${user.username}`, {
            ...user
        }).then(() => {
            dispatch(loadUsers());
            dispatch(deleteUserComplete(user));
        }).catch ((error) => {
            dispatch(deleteUserError(error.response.data, user));
        });
    }
}

export function deleteUserBegin(username) {
    return {
        type: ActionConstants.DELETE_USER_BEGIN,
        username
    }
}

export function deleteUserComplete(user) {
    return {
        type: ActionConstants.DELETE_USER_COMPLETE,
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
        dispatch(loadUserBegin());
        axios.get(`rest/users/${username}`).then((response) => {
            dispatch(loadUserComplete(response.data));
        }).catch ((error) => {
            dispatch(loadUserError(error.response.data));
        });
    }
}

export function loadUserBegin() {
    return {
        type: ActionConstants.LOAD_USER_BEGIN
    }
}

export function loadUserComplete(user) {
    return {
        type: ActionConstants.LOAD_USER_COMPLETE,
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
        dispatch(loadUsersBegin());
        axios.get('rest/users').then((response) => {
            dispatch(loadUsersComplete(response.data));
        }).catch ((error) => {
            dispatch(loadUsersError(error.response.data));
        });
    }
}

export function loadUsersBegin() {
    return {
        type: ActionConstants.LOAD_USERS_BEGIN
    }
}

export function loadUsersComplete(users) {
    return {
        type: ActionConstants.LOAD_USERS_COMPLETE,
        users
    }
}

export function loadUsersError(error) {
    return {
        type: ActionConstants.LOAD_USERS_ERROR,
        error
    }
}

