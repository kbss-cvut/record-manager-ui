import * as ActionConstants from "../constants/ActionConstants";
import {ACTION_STATUS} from "../constants/DefaultConstants";

export default function (state = {}, action) {
    switch (action.type) {
        case ActionConstants.LOAD_STATISTICS_PENDING:
            return {
                ...state,
                status: ACTION_STATUS.PENDING,
                error: ''
            };
        case ActionConstants.LOAD_STATISTICS_SUCCESS:
            return {
                ...state,
                status: ACTION_STATUS.SUCCESS,
                data: action.payload,
                error: ''
            };
        case ActionConstants.LOAD_STATISTICS_ERROR:
            return {
                ...state,
                status: ACTION_STATUS.ERROR,
                error: action.error
            };
        default:
            return state;
    }
}