import * as ActionConstants from "../constants/ActionConstants";
import {ACTION_STATUS} from "../constants/DefaultConstants";

export default function (state = {data: undefined}, action) {
    switch (action.type) {
        case ActionConstants.LOAD_STATISTICS_PENDING:
            return {
                ...state,
                status: ACTION_STATUS.PENDING,
                error: undefined,
                data: undefined
            };
        case ActionConstants.LOAD_STATISTICS_SUCCESS:
            return {
                ...state,
                status: ACTION_STATUS.SUCCESS,
                error: undefined,
                data: action.payload,
            };
        case ActionConstants.LOAD_STATISTICS_ERROR:
            return {
                ...state,
                status: ACTION_STATUS.ERROR,
                error: action.error,
                data: undefined
            };
        default:
            return state;
    }
}
