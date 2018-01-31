import * as ActionConstants from "../constants/ActionConstants";
import Actions from "./Actions";


export const createUser = (user) => {
    console.log("Creating new user: ", user);
    return {
        type: ActionConstants.CREATE_USER,
        payload: user
    }
};

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
