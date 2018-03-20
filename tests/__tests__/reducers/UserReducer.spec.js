'use strict';

import React from 'react';
import UserReducer from "../../../js/reducers/UserReducer";
import * as ActionConstants from "../../../js/constants/ActionConstants";
import {ACTION_FLAG, ACTION_STATUS} from "../../../js/constants/DefaultConstants";
import InstitutionReducer from "../../../js/reducers/InstitutionReducer";

describe('UserReducer', function () {
    const user = {username: 'test'},
          members = [
            {username: 'record1'},
            {username: 'record2'}
          ],
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
                status: ACTION_STATUS.PENDING
            },
            testEntry: initialState.testEntry
        };
        expect(newState).toEqual(expectedState);
    });

    it('should handle SAVE_USER_SUCCESS', () => {
        const initialState = {
            userSaved: {
                status: ACTION_STATUS.PENDING
            },
            testEntry: "should not touch"
        };
        const action = {
            type: ActionConstants.SAVE_USER_SUCCESS,
            actionFlag: ACTION_FLAG.CREATE_ENTITY,
            user,
        };

        const newState = UserReducer(initialState, action);

        const expectedState = {
            userSaved: {
                actionFlag: ACTION_FLAG.CREATE_ENTITY,
                status: ACTION_STATUS.SUCCESS,
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
                status: ACTION_STATUS.PENDING
            },
            testEntry: "should not touch"
        };
        const action = {
            type: ActionConstants.SAVE_USER_ERROR,
            actionFlag: ACTION_FLAG.CREATE_ENTITY,
            user,
            error
        };

        const newState = UserReducer(initialState, action);

        const expectedState = {
            userSaved: {
                actionFlag: ACTION_FLAG.CREATE_ENTITY,
                status: ACTION_STATUS.ERROR,
                user,
                error
            },
            testEntry: initialState.testEntry
        };
        expect(newState).toEqual(expectedState);
    });

    it('handles UNLOAD_SAVED_USER', () => {
        const initialState = {
            userSaved: {
                actionFlag: ACTION_FLAG.CREATE_ENTITY,
                status: ACTION_STATUS.SUCCESS,
                user,
                error: ''
            },
            testEntry: "should not touch"
        };

        expect(
            UserReducer(initialState, {
                type: ActionConstants.UNLOAD_SAVED_USER
            })
        ).toEqual(
            {
                userSaved: {
                    status: ACTION_STATUS.SUCCESS
                },
                testEntry: initialState.testEntry
            });
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
                status: ACTION_STATUS.PENDING,
                username: user.username
            },
            testEntry: initialState.testEntry
        };
        expect(newState).toEqual(expectedState);
    });

    it('should handle DELETE_USER_SUCCESS', () => {
        const initialState = {
            userDeleted: {
                status: ACTION_STATUS.PENDING
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
                status: ACTION_STATUS.SUCCESS,
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
                status: ACTION_STATUS.PENDING
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
                status: ACTION_STATUS.ERROR,
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
                status: ACTION_STATUS.PENDING,
            },
            testEntry2: initialState.testEntry2
        };
        expect(newState).toEqual(expectedState);
    });

    it('should handle LOAD_USER_SUCCESS', () => {
        const initialState = {
            userLoaded: {
                status: ACTION_STATUS.PENDING
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
                status: ACTION_STATUS.SUCCESS,
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
                status: ACTION_STATUS.PENDING
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
                status: ACTION_STATUS.ERROR,
                error
            },
            testEntry: initialState.testEntry
        };
        expect(newState).toEqual(expectedState);
    });

    it('should handle UNLOAD_USER', () => {
        const initialState = {
            userLoaded: {
                status: ACTION_STATUS.SUCCESS,
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
    
    it('handles LOAD_INSTITUTION_MEMBERS_PENDING action', () => {
        const initialState = {
            institutionMembers: {
            },
            testEntry: "should not touch"
        };

        expect(
            UserReducer(initialState, {
                type: ActionConstants.LOAD_INSTITUTION_MEMBERS_PENDING
            })
        ).toEqual(
            {
                institutionMembers: {
                    status: ACTION_STATUS.PENDING,
                },
                testEntry: initialState.testEntry
            });
    });

    it('handles LOAD_INSTITUTION_MEMBERS_SUCCESS action', () => {
        const initialState = {
            institutionMembers: {
                status: ACTION_STATUS.PENDING
            },
            testEntry: "should not touch"
        };

        expect(
            UserReducer(initialState, {
                type: ActionConstants.LOAD_INSTITUTION_MEMBERS_SUCCESS,
                members
            })
        ).toEqual(
            {
                institutionMembers: {
                    status: ACTION_STATUS.SUCCESS,
                    members,
                    error: ''
                },
                testEntry: initialState.testEntry
            });
    });

    it('handles LOAD_INSTITUTION_MEMBERS_ERROR action', () => {
        const initialState = {
            institutionMembers: {
                status: ACTION_STATUS.PENDING
            },
            testEntry: "should not touch"
        };

        expect(
            UserReducer(initialState, {
                type: ActionConstants.LOAD_INSTITUTION_MEMBERS_ERROR,
                error
            })
        ).toEqual(
            {
                institutionMembers: {
                    status: ACTION_STATUS.ERROR,
                    error
                },
                testEntry: initialState.testEntry
            });
    });

    it('handles PASSWORD_CHANGE_PENDING action', () => {
        const initialState = {
            passwordChange: {
            },
            testEntry: "should not touch"
        };

        expect(
            UserReducer(initialState, {
                type: ActionConstants.PASSWORD_CHANGE_PENDING
            })
        ).toEqual(
            {
                passwordChange: {
                    status: ACTION_STATUS.PENDING,
                },
                testEntry: initialState.testEntry
            });
    });

    it('handles PASSWORD_CHANGE_SUCCESS action', () => {
        const initialState = {
            passwordChange: {
                status: ACTION_STATUS.PENDING
            },
            testEntry: "should not touch"
        };

        expect(
            UserReducer(initialState, {
                type: ActionConstants.PASSWORD_CHANGE_SUCCESS
            })
        ).toEqual(
            {
                passwordChange: {
                    status: ACTION_STATUS.SUCCESS,
                    error: ''
                },
                testEntry: initialState.testEntry
            });
    });

    it('handles PASSWORD_CHANGE_ERROR action', () => {
        const initialState = {
            passwordChange: {
                status: ACTION_STATUS.PENDING
            },
            testEntry: "should not touch"
        };

        expect(
            UserReducer(initialState, {
                type: ActionConstants.PASSWORD_CHANGE_ERROR,
                error
            })
        ).toEqual(
            {
                passwordChange: {
                    status: ACTION_STATUS.ERROR,
                    error
                },
                testEntry: initialState.testEntry
            });
    });
});