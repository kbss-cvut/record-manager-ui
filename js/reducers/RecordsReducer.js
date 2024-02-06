import * as ActionConstants from "../constants/ActionConstants";
import {ACTION_STATUS} from "../constants/DefaultConstants";

const initialState = {
    recordsLoaded: {}
};

export default function (state = initialState, action) {
    switch (action.type) {
        case ActionConstants.LOAD_RECORDS_PENDING:
            return {
                ...state,
                recordsLoaded: {
                    ...state.recordsLoaded,
                    status: ACTION_STATUS.PENDING
                }
            };
        case ActionConstants.LOAD_RECORDS_SUCCESS:
            return {
                ...state,
                recordsLoaded: {
                    status: ACTION_STATUS.SUCCESS,
                    records: action.records,
                    pageCount: action.pageCount,
                    error: ''
                }
            };
        case ActionConstants.LOAD_RECORDS_ERROR:
            return {
                ...state,
                recordsLoaded: {
                    status: ACTION_STATUS.ERROR,
                    error: action.error
                }
            };
        default:
            return state;
    }
}