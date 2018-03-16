import {ACTION_FLAG, ACTION_STATUS} from "../../../js/constants/DefaultConstants";
import * as ActionConstants from "../../../js/constants/ActionConstants";
import InstitutionReducer from "../../../js/reducers/InstitutionReducer";

describe('InstitutionReducer', function () {
    const institution = {
            name: 'test'
        },
        key = 97972969812,
        error = {
            message: 'An error has occurred.'
        };

    it('should leave state unchanged if action not recognized', () => {
        const initialState = {
            institutionDeleted: {},
            testEntry: "should not touch"
        };

        expect(
            InstitutionReducer(initialState, {
                type: 'NONEXISTENT_ACTION_TYPE',
                payload: 'error'
            })
        ).toEqual(
            {
                institutionDeleted: {},
                testEntry: initialState.testEntry
            });
    });

    it('should handle SAVE_INSTITUTION_PENDING', () => {
        const initialState = {
            institutionSaved: {},
            testEntry: "should not touch"
        };

        expect(
            InstitutionReducer(initialState, {
                type: ActionConstants.SAVE_INSTITUTION_PENDING
            })
        ).toEqual(
            {
                institutionSaved: {
                    status: ACTION_STATUS.PENDING
                },
                testEntry: initialState.testEntry
            });
    });

    it('should handle SAVE_INSTITUTION_SUCCESS', () => {
        const initialState = {
            institutionSaved: {
                status: ACTION_STATUS.PENDING
            },
            testEntry: "should not touch"
        };

        expect(
            InstitutionReducer(initialState, {
                type: ActionConstants.SAVE_INSTITUTION_SUCCESS,
                actionFlag: ACTION_FLAG.CREATE_ENTITY,
                key,
                institution
            })
        ).toEqual(
            {
                institutionSaved: {
                    actionFlag: ACTION_FLAG.CREATE_ENTITY,
                    status: ACTION_STATUS.SUCCESS,
                    institution: {
                        ...institution,
                        key
                    },
                    error: ''
                },
                testEntry: initialState.testEntry
            });
    });

    it('should handle SAVE_INSTITUTION_ERROR', () => {
        const initialState = {
            institutionSaved: {
                status: ACTION_STATUS.PENDING
            },
            testEntry: "should not touch"
        };

        expect(
            InstitutionReducer(initialState, {
                type: ActionConstants.SAVE_INSTITUTION_ERROR,
                actionFlag: ACTION_FLAG.CREATE_ENTITY,
                institution,
                error
            })
        ).toEqual(
            {
                institutionSaved: {
                    actionFlag: ACTION_FLAG.CREATE_ENTITY,
                    status: ACTION_STATUS.ERROR,
                    institution,
                    error
                },
                testEntry: initialState.testEntry
            });
    });

    it('handles UNLOAD_SAVED_INSTITUTION', () => {
        const initialState = {
            institutionSaved: {
                actionFlag: ACTION_FLAG.CREATE_ENTITY,
                status: ACTION_STATUS.SUCCESS,
                institution,
                error: ''
            },
            testEntry: "should not touch"
        };

        expect(
            InstitutionReducer(initialState, {
                type: ActionConstants.UNLOAD_SAVED_INSTITUTION
            })
        ).toEqual(
            {
                institutionSaved: {
                    status: ACTION_STATUS.SUCCESS
                },
                testEntry: initialState.testEntry
            });
    });

    it('handles DELETE_INSTITUTION_PENDING', () => {
        const initialState = {
            institutionDeleted: {},
            testEntry: "should not touch"
        };

        expect(
            InstitutionReducer(initialState, {
                type: ActionConstants.DELETE_INSTITUTION_PENDING,
                key
            })
        ).toEqual(
            {
                institutionDeleted: {
                    status: ACTION_STATUS.PENDING,
                    key
                },
                testEntry: initialState.testEntry
            });
    });

    it('handles DELETE_INSTITUTION_SUCCESS', () => {
        const initialState = {
            institutionDeleted: {
                status: ACTION_STATUS.PENDING
            },
            testEntry: "should not touch"
        };

        expect(
            InstitutionReducer(initialState, {
                type: ActionConstants.DELETE_INSTITUTION_SUCCESS,
                institution
            })
        ).toEqual(
            {
                institutionDeleted: {
                    status: ACTION_STATUS.SUCCESS,
                    institution,
                    error: ''
                },
                testEntry: initialState.testEntry
            });
    });

    it('handles DELETE_INSTITUTION_ERROR', () => {
        const initialState = {
            institutionDeleted: {
                status: ACTION_STATUS.PENDING
            },
            testEntry: "should not touch"
        };

        expect(
            InstitutionReducer(initialState, {
                type: ActionConstants.DELETE_INSTITUTION_ERROR,
                institution,
                error
            })
        ).toEqual(
            {
                institutionDeleted: {
                    status: ACTION_STATUS.ERROR,
                    institution,
                    error
                },
                testEntry: initialState.testEntry
            });
    });

    it('should handle LOAD_INSTITUTION_PENDING', () => {
        const initialState = {
            institutionLoaded: {
                testEntry: "should not touch"
            },
            testEntry2: "should not touch"
        };

        expect(
            InstitutionReducer(initialState, {
                type: ActionConstants.LOAD_INSTITUTION_PENDING
            })
        ).toEqual(
            {
                institutionLoaded: {
                    testEntry: initialState.institutionLoaded.testEntry,
                    status: ACTION_STATUS.PENDING,
                },
                testEntry2: initialState.testEntry2
            });
    });

    it('should handle LOAD_INSTITUTION_SUCCESS', () => {
        const initialState = {
            institutionLoaded: {
                status: ACTION_STATUS.PENDING
            },
            testEntry: "should not touch"
        };

        expect(
            InstitutionReducer(initialState, {
                type: ActionConstants.LOAD_INSTITUTION_SUCCESS,
                institution
            })
        ).toEqual(
            {
                institutionLoaded: {
                    status: ACTION_STATUS.SUCCESS,
                    institution,
                    error: ''
                },
                testEntry: initialState.testEntry
            });
    });

    it('should handle LOAD_INSTITUTION_ERROR', () => {
        const initialState = {
            institutionLoaded: {
                status: ACTION_STATUS.PENDING
            },
            testEntry: "should not touch"
        };

        expect(
            InstitutionReducer(initialState, {
                type: ActionConstants.LOAD_INSTITUTION_ERROR,
                error
            })
        ).toEqual(
            {
                institutionLoaded: {
                    status: ACTION_STATUS.ERROR,
                    error
                },
                testEntry: initialState.testEntry
            });
    });

    it('should handle UNLOAD_INSTITUTION', () => {
        const initialState = {
            institutionLoaded: {
                status: ACTION_STATUS.SUCCESS,
                institution
            },
            testEntry: "should not touch"
        };

        expect(
            InstitutionReducer(initialState, {
                type: ActionConstants.UNLOAD_INSTITUTION
            })
        ).toEqual(
            {
                institutionLoaded: {},
                testEntry: initialState.testEntry
            });
    });
});