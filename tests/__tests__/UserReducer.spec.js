'use strict';

import React from 'react';
import UserReducer from "../../js/reducers/UserReducer";
import * as ActionConstants from "../../js/constants/ActionConstants";

describe('Testing UserReducer', function () {
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

    it('should handle SAVE_USER_BEGIN', () => {
        const initialState = {
            userSaved: {},
            testEntry: "should not touch"
        };
        const action = {
            type: ActionConstants.SAVE_USER_BEGIN,
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

    it('should handle SAVE_USER_COMPLETE', () => {
        const initialState = {
            userSaved: {
                fetching: true
            },
            testEntry: "should not touch"
        };
        const action = {
            type: ActionConstants.SAVE_USER_COMPLETE,
            actionType: 'CREATE',
            user: {
                username: 'test'
            }
        };

        const newState = UserReducer(initialState, action);

        const expectedState = {
            userSaved: {
                actionType: 'CREATE',
                fetching: false,
                success: true,
                user: {
                    username: 'test'
                },
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
            actionType: 'CREATE',
            user: {
                username: 'test'
            },
            error: {
                message: 'big error'
            }
        };

        const newState = UserReducer(initialState, action);

        const expectedState = {
            userSaved: {
                actionType: 'CREATE',
                fetching: false,
                success: false,
                user: {
                    username: 'test'
                },
                error: {
                    message: 'big error'
                }
            },
            testEntry: initialState.testEntry
        };
        expect(newState).toEqual(expectedState);
    });

    it('should handle DELETE_USER_BEGIN', () => {
        const initialState = {
            userDeleted: {},
            testEntry: "should not touch"
        };
        const action = {
            type: ActionConstants.DELETE_USER_BEGIN,
            username: 'test'
        };

        const newState = UserReducer(initialState, action);

        const expectedState = {
            userDeleted: {
                fetching: true,
                username: 'test'
            },
            testEntry: initialState.testEntry
        };
        expect(newState).toEqual(expectedState);
    });

    it('should handle DELETE_USER_COMPLETE', () => {
        const initialState = {
            userDeleted: {
                fetching: true
            },
            testEntry: "should not touch"
        };
        const action = {
            type: ActionConstants.DELETE_USER_COMPLETE,
            user: {
                username: 'test'
            }
        };

        const newState = UserReducer(initialState, action);

        const expectedState = {
            userDeleted: {
                fetching: false,
                success: true,
                user: {
                    username: 'test'
                },
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
            user: {
                username: 'test'
            },
            error: {
                message: 'big error'
            }
        };

        const newState = UserReducer(initialState, action);

        const expectedState = {
            userDeleted: {
                fetching: false,
                success: false,
                user: {
                    username: 'test'
                },
                error: {
                    message: 'big error'
                }
            },
            testEntry: initialState.testEntry
        };
        expect(newState).toEqual(expectedState);
    });

    it('should handle LOAD_USER_BEGIN', () => {
        const initialState = {
            userLoaded: {
                testEntry: "should not touch"
            },
            testEntry2: "should not touch"
        };
        const action = {
            type: ActionConstants.LOAD_USER_BEGIN,
            username: 'test'
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

    it('should handle LOAD_USER_COMPLETE', () => {
        const initialState = {
            userLoaded: {
                fetching: true
            },
            testEntry: "should not touch"
        };
        const action = {
            type: ActionConstants.LOAD_USER_COMPLETE,
            user: {
                username: 'test'
            }
        };

        const newState = UserReducer(initialState, action);

        const expectedState = {
            userLoaded: {
                fetching: false,
                success: true,
                user: {
                    username: 'test'
                },
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
            error: {
                message: 'big error'
            }
        };

        const newState = UserReducer(initialState, action);

        const expectedState = {
            userLoaded: {
                fetching: false,
                success: false,
                error: {
                    message: 'big error'
                }
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
                user: {
                    username: 'test'
                }
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

    it('should handle LOAD_USERS_BEGIN', () => {
        const initialState = {
            usersLoaded: {
                testEntry: "should not touch"
            },
            testEntry2: "should not touch"
        };
        const action = {
            type: ActionConstants.LOAD_USERS_BEGIN,
        };

        const newState = UserReducer(initialState, action);

        const expectedState = {
            usersLoaded: {
                testEntry: initialState.usersLoaded.testEntry,
                fetching: true,
            },
            testEntry2: initialState.testEntry2
        };
        expect(newState).toEqual(expectedState);
    });

    it('should handle LOAD_USERS_COMPLETE', () => {
        const initialState = {
            usersLoaded: {
                fetching: true
            },
            testEntry: "should not touch"
        };
        const action = {
            type: ActionConstants.LOAD_USERS_COMPLETE,
            users: [{username: 'test1'}, {username: 'test2'}]
        };

        const newState = UserReducer(initialState, action);

        const expectedState = {
            usersLoaded: {
                fetching: false,
                success: true,
                users: [{username: 'test1'}, {username: 'test2'}],
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
            error: {
                message: 'big error'
            }
        };

        const newState = UserReducer(initialState, action);

        const expectedState = {
            usersLoaded: {
                fetching: false,
                success: false,
                error: {
                    message: 'big error'
                }
            },
            testEntry: initialState.testEntry
        };
        expect(newState).toEqual(expectedState);
    });
});