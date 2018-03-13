import {ACTION_STATUS} from "../../../js/constants/DefaultConstants";
import * as ActionConstants from "../../../js/constants/ActionConstants";
import RecordsReducer from "../../../js/reducers/RecordsReducer";

describe('RecordsReducer', function () {
    const records = [{key: 12345678}, {key: 23456789}],
        error = {
            message: 'An error has occurred.'
        };

    it('handles LOAD_RECORDS_PENDING', () => {
        const initialState = {
            recordsLoaded: {
                testEntry1: "should not touch"
            },
            testEntry2: "should not touch"
        };

        expect(
            RecordsReducer(initialState, {
                type: ActionConstants.LOAD_RECORDS_PENDING,
            })
        ).toEqual(
            {
                recordsLoaded: {
                    status: ACTION_STATUS.PENDING,
                    testEntry1: "should not touch"
                },
                testEntry2: "should not touch"
            });
    });

    it('handles LOAD_RECORDS_SUCCESS', () => {
        const initialState = {
            recordsLoaded: {
                status: ACTION_STATUS.PENDING
            },
            testEntry: "should not touch"
        };

        expect(
            RecordsReducer(initialState, {
                type: ActionConstants.LOAD_RECORDS_SUCCESS,
                records
            })
        ).toEqual(
            {
                recordsLoaded: {
                    status: ACTION_STATUS.SUCCESS,
                    records,
                    error: ''
                },
                testEntry: initialState.testEntry
            });
    });

    it('handles LOAD_RECORDS_ERROR', () => {
        const initialState = {
            recordsLoaded: {
                status: ACTION_STATUS.PENDING
            },
            testEntry: "should not touch"
        };

        expect(
            RecordsReducer(initialState, {
                type: ActionConstants.LOAD_RECORDS_ERROR,
                error
            })
        ).toEqual(
            {
                recordsLoaded: {
                    status: ACTION_STATUS.ERROR,
                    error
                },
                testEntry: initialState.testEntry
            });
    });
});