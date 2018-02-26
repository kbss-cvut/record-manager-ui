'use strict';

import React from 'react';
import UserReducer from "../../js/reducers/UserReducer";
import * as ActionConstants from "../../js/constants/ActionConstants";
import {ACTION_FLAG} from "../../js/constants/DefaultConstants";

describe('Testing UserReducer', function () {
    const user = {username: 'test'},
          error = {
              message: 'An error has occurred.'
          };

    it('should leave state unchanged if action not recognized', () => {
        const initialState = {
            testEntry: 'should not touch'
        };
        const action = {type: 'NONEXISTENT_ACTION_TYPE', payload: 'error'};

        const newState = UserReducer(initialState, action);

        const expectedState = {
            testEntry: initialState.testEntry
        };
        expect(newState).toEqual(expectedState);
    });

    it('should handle SAVE_USER_PENDING', () => {
        const initialState = {
            userSaved: {},
            testEntry: "should not touch"
        };
        const action = {
            type: ActionConstants.SAVE_USER_PENDING,
        };

        const newState = UserReducer(initialState, action);

        const expectedState = {
            userSaved: {
                fetching: true
            },
            testEntry: initialState.testEntry
        };
        expect(newState).toEqual(expectedState);
    });

    it('should handle SAVE_USER_SUCCESS', () => {
        const initialState = {
            userSaved: {
                fetching: true
            },
            testEntry: "should not touch"
        };
        const action = {
            type: ActionConstants.SAVE_USER_SUCCESS,
            actionFlag: ACTION_FLAG.CREATE_USER,
            user,
        };

        const newState = UserReducer(initialState, action);

        const expectedState = {
            userSaved: {
                actionFlag: ACTION_FLAG.CREATE_USER,
                fetching: false,
                success: true,
                user,
                error: ''
            },
            testEntry: initialState.testEntry
        };
        expect(newState).toEqual(expectedState);
    });

    it('should handle SAVE_USER_ERROR', () => {
        const initialState = {
            userSaved: {
                fetching: true
            },
            testEntry: "should not touch"
        };
        const action = {
            type: ActionConstants.SAVE_USER_ERROR,
            actionFlag: ACTION_FLAG.CREATE_USER,
            user,
            error
        };

        const newState = UserReducer(initialState, action);

        const expectedState = {
            userSaved: {
                actionFlag: ACTION_FLAG.CREATE_USER,
                fetching: false,
                success: false,
                user,
                error
            },
            testEntry: initialState.testEntry
        };
        expect(newState).toEqual(expectedState);
    });

    it('should handle DELETE_USER_PENDING', () => {
        const initialState = {
            userDeleted: {},
            testEntry: "should not touch"
        };
        const action = {
            type: ActionConstants.DELETE_USER_PENDING,
            username: user.username
        };

        const newState = UserReducer(initialState, action);

        const expectedState = {
            userDeleted: {
                fetching: true,
                username: user.username
            },
            testEntry: initialState.testEntry
        };
        expect(newState).toEqual(expectedState);
    });

    it('should handle DELETE_USER_SUCCESS', () => {
        const initialState = {
            userDeleted: {
                fetching: true
            },
            testEntry: "should not touch"
        };
        const action = {
            type: ActionConstants.DELETE_USER_SUCCESS,
            user
        };

        const newState = UserReducer(initialState, action);

        const expectedState = {
            userDeleted: {
                fetching: false,
                success: true,
                user,
                error: ''
            },
            testEntry: initialState.testEntry
        };
        expect(newState).toEqual(expectedState);
    });

    it('should handle DELETE_USER_ERROR', () => {
        const initialState = {
            userDeleted: {
                fetching: true
            },
            testEntry: "should not touch"
        };
        const action = {
            type: ActionConstants.DELETE_USER_ERROR,
            user,
            error
        };

        const newState = UserReducer(initialState, action);

        const expectedState = {
            userDeleted: {
                fetching: false,
                success: false,
                user,
                error
            },
            testEntry: initialState.testEntry
        };
        expect(newState).toEqual(expectedState);
    });

    it('should handle LOAD_USER_PENDING', () => {
        const initialState = {
            userLoaded: {
                testEntry: "should not touch"
            },
            testEntry2: "should not touch"
        };
        const action = {
            type: ActionConstants.LOAD_USER_PENDING,
            username: user.username
        };

        const newState = UserReducer(initialState, action);

        const expectedState = {
            userLoaded: {
                testEntry: initialState.userLoaded.testEntry,
                fetching: true,
            },
            testEntry2: initialState.testEntry2
        };
        expect(newState).toEqual(expectedState);
    });

    it('should handle LOAD_USER_SUCCESS', () => {
        const initialState = {
            userLoaded: {
                fetching: true
            },
            testEntry: "should not touch"
        };
        const action = {
            type: ActionConstants.LOAD_USER_SUCCESS,
            user
        };

        const newState = UserReducer(initialState, action);

        const expectedState = {
            userLoaded: {
                fetching: false,
                success: true,
                user,
                error: ''
            },
            testEntry: initialState.testEntry
        };
        expect(newState).toEqual(expectedState);
    });

    it('should handle LOAD_USER_ERROR', () => {
        const initialState = {
            userLoaded: {
                fetching: true
            },
            testEntry: "should not touch"
        };
        const action = {
            type: ActionConstants.LOAD_USER_ERROR,
            error
        };

        const newState = UserReducer(initialState, action);

        const expectedState = {
            userLoaded: {
                fetching: false,
                success: false,
                error
            },
            testEntry: initialState.testEntry
        };
        expect(newState).toEqual(expectedState);
    });

    it('should handle UNLOAD_USER', () => {
        const initialState = {
            userLoaded: {
                fetching: false,
                success: true,
                user
            },
            testEntry: "should not touch"
        };
        const action = {
            type: ActionConstants.UNLOAD_USER,
        };

        const newState = UserReducer(initialState, action);

        const expectedState = {
            userLoaded: {},
            testEntry: initialState.testEntry
        };
        expect(newState).toEqual(expectedState);
    });
});