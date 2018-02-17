import * as ActionConstants from "../constants/ActionConstants";
import * as Ajax from "../utils/Ajax";
import * as Utils from "../utils/Utils";
import Actions from "../actions/Actions";
import {ACTION_TYPE} from "../constants/DefaultConstants";
import Routing from "../utils/Routing";
import Routes from "../utils/Routes";

export function createUser(user) {
    console.log("Creating user: ", user);
    return function (dispatch) {
        dispatch(saveUserBegin());
        Ajax.post('rest/users').send(user).end(() => {
            dispatch(saveUserComplete(user, ACTION_TYPE.CREATE_USER));
            Actions.loadAllUsers();
        }, (error) => {
            dispatch(saveUserError(error, user, ACTION_TYPE.CREATE_USER));
        });
    }
}

export function updateUser(user) {
    console.log("Updating user: ", user);
    return function (dispatch) {
        dispatch(saveUserBegin(ACTION_TYPE.UPDATE_USER));
        Ajax.put(`rest/users/${user.username}`).send(user).end(() => {
            dispatch(saveUserComplete(user, ACTION_TYPE.UPDATE_USER));
            Actions.loadAllUsers();
        }, (error) => {
            dispatch(saveUserError(error, user, ACTION_TYPE.UPDATE_USER));
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
}export function loadUser(username) {
export function loadUser(username) {
    console.log("Loading user with username: ", username);
    return function (dispatch) {
        dispatch(loadUserBegin());
        Ajax.get(`rest/users/${username}`).end((data) => {
            dispatch(loadUserComplete(data));
        }, (error) => {
            dispatch(loadUserError(error));
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
