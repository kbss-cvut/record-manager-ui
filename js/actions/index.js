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
        dispatch(saveUserBegin(ACTION_TYPE.CREATE_USER));
        Ajax.post('rest/users').send(user).end((data, resp) => {
            const username = Utils.extractKeyFromLocationHeader(resp);
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
        Ajax.put(`rest/users/${user.username}`).send(user).end((data, resp) => {
            const username = Utils.extractKeyFromLocationHeader(resp);
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
}