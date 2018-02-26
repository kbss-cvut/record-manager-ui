import React from 'react';
import * as ActionConstants from "../../js/constants/ActionConstants";
import * as actions from "../../js/actions";
import {ACTION_FLAG} from "../../js/constants/DefaultConstants";

describe('Testing User asynchronize actions', function () {
    it('should create an action to save user', () => {
        const actionFlag = ACTION_FLAG.CREATE_USER;
        const expectedAction = {
            type: ActionConstants.SAVE_USER_PENDING,
            actionFlag
        };
        expect(actions.saveUserPending(actionFlag)).toEqual(expectedAction)
    });

    it('should create an action to announce successful save of user', () => {
        const actionFlag = ACTION_FLAG.CREATE_USER ;
        const user = {username: 'test'};
        const expectedAction = {
            type: ActionConstants.SAVE_USER_SUCCESS,
            user,
            actionFlag
        };
        expect(actions.saveUserSuccess(user, actionFlag)).toEqual(expectedAction)
    });

    it('should create an action to announce unsuccessful save of user', () => {
        const actionFlag = ACTION_FLAG.UPDATE_USER ;
        const error = {message: 'error'};
        const user = {username: 'test'};
        const expectedAction = {
            type: ActionConstants.SAVE_USER_ERROR,
            error,
            user,
            actionFlag,
        };
        expect(actions.saveUserError(error, user, actionFlag)).toEqual(expectedAction)
    });

    it('should create an action to delete user', () => {
        const username = 'test';
        const expectedAction = {
            type: ActionConstants.DELETE_USER_PENDING,
            username
        };
        expect(actions.deleteUserPending(username)).toEqual(expectedAction)
    });

    it('should create an action to announce successful delete of user', () => {
        const user = {username: 'test'};
        const expectedAction = {
            type: ActionConstants.DELETE_USER_SUCCESS,
            user
        };
        expect(actions.deleteUserSuccess(user)).toEqual(expectedAction)
    });

    it('should create an action to announce unsuccessful delete of user', () => {
        const error = {message: 'error'};
        const user = {username: 'test'};
        const expectedAction = {
            type: ActionConstants.DELETE_USER_ERROR,
            error,
            user
        };
        expect(actions.deleteUserError(error, user)).toEqual(expectedAction)
    });

    it('should create an action to fetch user', () => {
        const expectedAction = {
            type: ActionConstants.LOAD_USER_PENDING,
        };
        expect(actions.loadUserPending()).toEqual(expectedAction)
    });

    it('should create an action to save fetched user', () => {
        const user = {username: 'test'};
        const expectedAction = {
            type: ActionConstants.LOAD_USER_SUCCESS,
            user
        };
        expect(actions.loadUserSuccess(user)).toEqual(expectedAction)
    });

    it('should create an action about error during fetching user', () => {
        const error = {message: 'error'};
        const expectedAction = {
            type: ActionConstants.LOAD_USER_ERROR,
            error
        };
        expect(actions.loadUserError(error)).toEqual(expectedAction)
    });

    it('should create an action to unload loaded user', () => {
        const expectedAction = {
            type: ActionConstants.UNLOAD_USER,
        };
        expect(actions.unloadUser()).toEqual(expectedAction)
    });

    it('should create an action to fetch all users', () => {
        const expectedAction = {
            type: ActionConstants.LOAD_USERS_PENDING,
        };
        expect(actions.loadUsersPending()).toEqual(expectedAction)
    });

    it('should create an action to save fetched users', () => {
        const users = [{username: 'test1'},{username: 'test2'}];
        const expectedAction = {
            type: ActionConstants.LOAD_USERS_SUCCESS,
            users
        };
        expect(actions.loadUsersSuccess(users)).toEqual(expectedAction)
    });

    it('should create an action about error during fetching users', () => {
        const error = {message: 'error'};
        const expectedAction = {
            type: ActionConstants.LOAD_USERS_ERROR,
            error
        };
        expect(actions.loadUsersError(error)).toEqual(expectedAction)
    });
});