import * as ActionConstants from "../constants/ActionConstants";
import {ACTION_STATUS} from "../constants/DefaultConstants";

const initialState = {
    actionsLoaded: {},
    actionLoaded: {}
};

export default function (state = initialState, action) {
    switch (action.type) {
        case ActionConstants.LOAD_ACTIONS_HISTORY_PENDING:
            return {
                ...state,
                actionsLoaded: {
                    status: ACTION_STATUS.PENDING
                }
            };
        case ActionConstants.LOAD_ACTIONS_HISTORY_SUCCESS:
            return {
                ...state,
                actionsLoaded: {
                    status: ACTION_STATUS.SUCCESS,
                    actions: action.actionsHistory,
                    error: ''
                }
            };
        case ActionConstants.LOAD_ACTIONS_HISTORY_ERROR:
            return {
                ...state,
                actionsLoaded: {
                    status: ACTION_STATUS.ERROR,
                    error: action.error
                }
            };
        case ActionConstants.LOAD_ACTION_HISTORY_PENDING:
            return {
                ...state,
                actionLoaded: {
                    status: ACTION_STATUS.PENDING
                }
            };
        case ActionConstants.LOAD_ACTION_HISTORY_SUCCESS:
            return {
                ...state,
                actionLoaded: {
                    status: ACTION_STATUS.SUCCESS,
                    action: action.actionHistory,
                    error: ''
                }
            };
        case ActionConstants.LOAD_ACTION_HISTORY_ERROR:
            return {
                ...state,
                actionLoaded: {
                    status: ACTION_STATUS.ERROR,
                    error: action.error
                }
            };
        case ActionConstants.UNLOAD_ACTION_HISTORY:
            return {
                ...state,
                actionLoaded: {}
            };
        default:
            return state;
    }
}