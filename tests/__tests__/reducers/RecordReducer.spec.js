import RecordReducer from "../../../js/reducers/RecordReducer";
import * as ActionConstants from "../../../js/constants/ActionConstants";
import {ACTION_STATUS} from "../../../js/constants/DefaultConstants";

describe('RecordReducer', function () {
    const patients = [
            {localName: 'record1'},
            {localName: 'record2'}
        ],
        error = {
            message: 'An error has occurred.'
        };

    it('leaves state unchanged if action not recognized', () => {
        const initialState = {
            institutionPatients: {
                patients
            },
            testEntry: "should not touch"
        };

        expect(
            RecordReducer(initialState, {
                type: 'NONEXISTENT_ACTION_TYPE',
                payload: 'error'
            })
        ).toEqual(
            {
                institutionPatients: {
                    patients
                },
                testEntry: "should not touch"
            });
    });

    it('handles LOAD_INSTITUTION_PATIENTS_PENDING action', () => {
        const initialState = {
            institutionPatients: {
            },
            testEntry: "should not touch"
        };

        expect(
            RecordReducer(initialState, {
                type: ActionConstants.LOAD_INSTITUTION_PATIENTS_PENDING
            })
        ).toEqual(
            {
                institutionPatients: {
                    status: ACTION_STATUS.PENDING,
                },
                testEntry: initialState.testEntry
            });
    });

    it('handles LOAD_INSTITUTION_PATIENTS_SUCCESS action', () => {
        const initialState = {
            institutionPatients: {
                status: ACTION_STATUS.PENDING
            },
            testEntry: "should not touch"
        };

        expect(
            RecordReducer(initialState, {
                type: ActionConstants.LOAD_INSTITUTION_PATIENTS_SUCCESS,
                patients
            })
        ).toEqual(
            {
                institutionPatients: {
                    status: ACTION_STATUS.SUCCESS,
                    patients,
                    error: ''
                },
                testEntry: initialState.testEntry
            });
    });

    it('handles LOAD_INSTITUTION_PATIENTS_ERROR action', () => {
        const initialState = {
            institutionPatients: {
                status: ACTION_STATUS.PENDING
            },
            testEntry: "should not touch"
        };

        expect(
            RecordReducer(initialState, {
                type: ActionConstants.LOAD_INSTITUTION_PATIENTS_ERROR,
                error
            })
        ).toEqual(
            {
                institutionPatients: {
                    status: ACTION_STATUS.ERROR,
                    error
                },
                testEntry: initialState.testEntry
            });
    });
});
