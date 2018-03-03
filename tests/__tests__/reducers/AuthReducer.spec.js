
import React from 'react';
import * as ActionConstants from "../../../js/constants/ActionConstants";
import {ACTION_FLAG, ACTION_STATUS} from "../../../js/constants/DefaultConstants";
import {getRole} from "../../../js/utils/Utils";
import AuthReducer from "../../../js/reducers/AuthReducer";

describe('UserReducer', function () {
    const user = {
            username: 'test',
            types:[
                "http://vfn.cz/ontologies/study-manager/administrator",
                "http://vfn.cz/ontologies/study-manager/doctor"
            ]},
        error = {
            message: 'An error has occurred.'
        };

    it('should handle AUTH_USER', () => {
        const initialState = {
            authenticated: false,
            isLoaded: false,
            testEntry: "should not touch"
        };
        const action = {
            type: ActionConstants.AUTH_USER,
        };

        const newState = AuthReducer(initialState, action);

        const expectedState = {
            error: '',
            authenticated: true,
            isLoaded: false,
            testEntry: initialState.testEntry
        };
        expect(newState).toEqual(expectedState);
    });

    it('should handle AUTH_USER_ERROR', () => {
        const initialState = {
            authenticated: false,
            isLoaded: false,
            testEntry: "should not touch"
        };
        const action = {
            type: ActionConstants.AUTH_USER_ERROR,
            error
        };

        const newState = AuthReducer(initialState, action);

        const expectedState = {
            testEntry: "should not touch",
            authenticated: false,
            isLoaded: false,
            error
        };
        expect(newState).toEqual(expectedState);
    });

    it('should handle UNAUTH_USER', () => {
        const initialState = {
            authenticated: false,
            isLoaded: false,
            testEntry: "should not touch"
        };
        const action = {
            type: "UNAUTH_USER",
        };

        const newState = AuthReducer(initialState, action);

        const expectedState = {
            authenticated: false
        };

        expect(newState).toEqual(expectedState);
    });

    it('should handle LOAD_USER_PROFILE_PENDING', () => {
        const initialState = {
            authenticated: false,
            isLoaded: false,
            testEntry: "should not touch"
        };
        const action = {
            type: ActionConstants.LOAD_USER_PROFILE_PENDING,
        };

        const newState = AuthReducer(initialState, action);

        const expectedState = {
            isLoaded: false,
            authenticated: false,
            status: ACTION_STATUS.PENDING,
            testEntry: initialState.testEntry
        };
        expect(newState).toEqual(expectedState);
    });

    it('should handle LOAD_USER_PROFILE_SUCCESS', () => {
        const initialState = {
            authenticated: false,
            isLoaded: false,
            testEntry: "should not touch"
        };
        const action = {
            type: ActionConstants.LOAD_USER_PROFILE_SUCCESS,
            user,
        };

        const newState = AuthReducer(initialState, action);

        const expectedState = {
            isLoaded: true,
            authenticated: true,
            status: ACTION_STATUS.SUCCESS,
            user: {
                ...user,
                role: getRole(user)
            },
            testEntry: initialState.testEntry
        };
        expect(newState).toEqual(expectedState);
    });

    it('should handle LOAD_USER_PROFILE_ERROR', () => {
        const initialState = {
            authenticated: false,
            isLoaded: false,
            testEntry: "should not touch"
        };
        const action = {
            type: ActionConstants.LOAD_USER_PROFILE_ERROR,
            error
        };

        const newState = AuthReducer(initialState, action);

        const expectedState = {
            isLoaded: false,
            authenticated: false,
            status: ACTION_STATUS.ERROR,
            error: error,
            testEntry: initialState.testEntry
        };
        expect(newState).toEqual(expectedState);
    });
});