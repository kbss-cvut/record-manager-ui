import React from 'react';
import * as ActionConstants from "../../js/constants/ActionConstants";
import * as actions from "../../js/actions";
import expect from 'expect'

describe('Testing User actions', function () {
    it('should create an action to save user', () => {
        const actionType = 'CREATE';
        const expectedAction = {
            type: ActionConstants.SAVE_USER_BEGIN,
            actionType
        };
        expect(actions.saveUserBegin(actionType)).toEqual(expectedAction)
    });

    it('should create an action to announce successful save of user', () => {
        const actionType = 'CREATE';
        const user = {username: 'test'};
        const expectedAction = {
            type: ActionConstants.SAVE_USER_COMPLETE,
            user,
            actionType
        };
        expect(actions.saveUserComplete(user, actionType)).toEqual(expectedAction)
    });

    it('should create an action to announce unsuccessful save of user', () => {
        const actionType = 'UPDATE';
        const error = {message: 'error'};
        const user = {username: 'test'};
        const expectedAction = {
            type: ActionConstants.SAVE_USER_ERROR,
            error,
            user,
            actionType,
        };
        expect(actions.saveUserError(error, user, actionType)).toEqual(expectedAction)
    });

    it('should create an action to delete user', () => {
        const username = 'test';
        const expectedAction = {
            type: ActionConstants.DELETE_USER_BEGIN,
            username
        };
        expect(actions.deleteUserBegin(username)).toEqual(expectedAction)
    });

    it('should create an action to announce successful delete of user', () => {
        const user = {username: 'test'};
        const expectedAction = {
            type: ActionConstants.DELETE_USER_COMPLETE,
            user
        };
        expect(actions.deleteUserComplete(user)).toEqual(expectedAction)
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
            type: ActionConstants.LOAD_USER_BEGIN,
        };
        expect(actions.loadUserBegin()).toEqual(expectedAction)
    });

    it('should create an action to save fetched user', () => {
        const user = {username: 'test'};
        const expectedAction = {
            type: ActionConstants.LOAD_USER_COMPLETE,
            user
        };
        expect(actions.loadUserComplete(user)).toEqual(expectedAction)
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
            type: ActionConstants.LOAD_USERS_BEGIN,
        };
        expect(actions.loadUsersBegin()).toEqual(expectedAction)
    });

    it('should create an action to save fetched users', () => {
        const users = [{username: 'test1'},{username: 'test2'}];
        const expectedAction = {
            type: ActionConstants.LOAD_USERS_COMPLETE,
            users
        };
        expect(actions.loadUsersComplete(users)).toEqual(expectedAction)
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