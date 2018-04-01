import * as ActionConstants from "../constants/ActionConstants";
import {ACTION_STATUS} from "../constants/DefaultConstants";

const initialState = {
};

export default function (state = initialState, action) {
    switch (action.type) {
        case ActionConstants.LOAD_ACTIONS_HISTORY_PENDING:
            return {
                ...state,
                status: ACTION_STATUS.PENDING
            };
        case ActionConstants.LOAD_ACTIONS_HISTORY_SUCCESS:
            return {
                ...state,
                status: ACTION_STATUS.SUCCESS,
                actions: action.actionsHistory,
                error: ''
            };
        case ActionConstants.LOAD_ACTIONS_HISTORY_ERROR:
            return {
                ...state,
                status: ACTION_STATUS.ERROR,
                error: action.error
            };
        default:
            return state;
    }
}