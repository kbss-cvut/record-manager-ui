'use strict';

import React from 'react';
import * as ActionConstants from "../../js/constants/ActionConstants";
import UsersReducer from "../../js/reducers/UsersReducer";

describe('Testing UsersReducer', function () {
    const users = [{username: 'test1'}, {username: 'test2'}],
          error = {
              message: 'An error has occurred.'
          };

    it('should handle LOAD_USERS_PENDING', () => {
        const initialState = {
            usersLoaded: {
                testEntry: "should not touch"
            },
            testEntry2: "should not touch"
        };
        const action = {
            type: ActionConstants.LOAD_USERS_PENDING,
        };

        const newState = UsersReducer(initialState, action);

        const expectedState = {
            usersLoaded: {
                testEntry: initialState.usersLoaded.testEntry,
                fetching: true,
            },
            testEntry2: initialState.testEntry2
        };
        expect(newState).toEqual(expectedState);
    });

    it('should handle LOAD_USERS_SUCCESS', () => {
        const initialState = {
            usersLoaded: {
                fetching: true
            },
            testEntry: "should not touch"
        };
        const action = {
            type: ActionConstants.LOAD_USERS_SUCCESS,
            users: [{username: 'test1'}, {username: 'test2'}]
        };

        const newState = UsersReducer(initialState, action);

        const expectedState = {
            usersLoaded: {
                fetching: false,
                success: true,
                users,
                error: ''
            },
            testEntry: initialState.testEntry
        };
        expect(newState).toEqual(expectedState);
    });

    it('should handle LOAD_USERS_ERROR', () => {
        const initialState = {
            usersLoaded: {
                fetching: true
            },
            testEntry: "should not touch"
        };
        const action = {
            type: ActionConstants.LOAD_USERS_ERROR,
            error
        };

        const newState = UsersReducer(initialState, action);

        const expectedState = {
            usersLoaded: {
                fetching: false,
                success: false,
                error
            },
            testEntry: initialState.testEntry
        };
        expect(newState).toEqual(expectedState);
    });
});