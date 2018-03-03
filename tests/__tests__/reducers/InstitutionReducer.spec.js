import {ACTION_STATUS} from "../../../js/constants/DefaultConstants";
import * as ActionConstants from "../../../js/constants/ActionConstants";
import InstitutionReducer from "../../../js/reducers/InstitutionReducer";

describe('InstitutionReducer', function () {
    const institution = {key: 'test'},
        error = {
            message: 'An error has occurred.'
        };

    it('handles DELETE_INSTITUTION_PENDING', () => {
        const initialState = {
            institutionDeleted: {},
            testEntry: "should not touch"
        };

        expect(
            InstitutionReducer(initialState, {
                type: ActionConstants.DELETE_INSTITUTION_PENDING,
                key: institution.key
            })
        ).toEqual(
            {
                institutionDeleted: {
                    status: ACTION_STATUS.PENDING,
                    key: institution.key
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
});