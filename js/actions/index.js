import * as ActionConstants from "../constants/ActionConstants";
import * as Ajax from "../utils/Ajax";
import * as Utils from "../utils/Utils";
import Actions from "../actions/Actions";

export function createUser(user, onSuccess, onError) {
    console.log("Creating new user: ", user);
    return function (dispatch) {
        dispatch(createUserFetching());
        Ajax.post('rest/users').send(user).end((data, resp) => {
            const username = Utils.extractKeyFromLocationHeader(resp);
            if (onSuccess) {
                onSuccess(username);
            }
            dispatch(createUserComplete(username));
            Actions.loadAllUsers();
        }, (error) => {
            onError(error);
            dispatch(createUserError(error));
        });
    }
}

export function createUserFetching() {
    return {
        type: ActionConstants.CREATE_USER_FETCHING
    }
}

export function createUserComplete(username) {
    return {
        type: ActionConstants.CREATE_USER_COMPLETE,
        username
    }
}

export function createUserError(error) {
    return {
        type: ActionConstants.CREATE_USER_ERROR,
        error
    }
}

/*
export const updateUser = (user) => {
    console.log("Updating new user: ", user);
    return { type: ActionConstants.UPDATE_USER};
    // set loading tag
    // ? set error message ?

    // Ajax.put('rest/users/' + user.username).send(user).end(onSuccess, onError);
    //
    //
    // return {
    //     type: ActionConstants.UPDATE_USER,
    //     payload: user
    // }
    //
    //
    //
    //
    // var user = this.state.user;
    // if (user.isNew) {
    //     delete user.isNew;
    //     Actions.createUser(user, this._onSaveSuccess, this._onSaveError);
    // } else {
    //     Actions.updateUser(user, this._onSaveSuccess, this._onSaveError);
    // }
    //
    //
    // onUpdateUser: function (user, onSuccess, onError) {
    //
    // },
    //
    //
    // onCreateUser: function (user, onSuccess, onError) {
    //     Ajax.post('rest/users').send(user).end((data, resp) => {
    //         if (onSuccess) {
    //             var username = Utils.extractKeyFromLocationHeader(resp);
    //             onSuccess(username);
    //         }
    //         Actions.loadAllUsers();
    //     }, onError);
    // },
};
*/