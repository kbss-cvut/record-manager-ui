import * as ActionConstants from "../constants/ActionConstants";
import {ACTION_STATUS} from "../constants/DefaultConstants";

const initialState = {
    institutionPatients: {},
    recordDeleted: {},
    recordLoaded: {},
    recordSaved: {}
};

export default function (state = initialState, action) {
    switch (action.type) {
        case ActionConstants.SAVE_RECORD_PENDING:
            return {
                ...state,
                recordSaved: {
                    status: ACTION_STATUS.PENDING
                }
            };
        case ActionConstants.SAVE_RECORD_SUCCESS:
            return {
                ...state,
                recordSaved: {
                    actionFlag: action.actionFlag,
                    status: ACTION_STATUS.SUCCESS,
                    record: {
                        ...action.record,
                        key: action.key
                    },
                    error: ''
                }
            };
        case ActionConstants.SAVE_RECORD_ERROR:
            return {
                ...state,
                recordSaved: {
                    actionFlag: action.actionFlag,
                    status: ACTION_STATUS.ERROR,
                    record: action.record,
                    error: action.error
                }
            };
        case ActionConstants.UNLOAD_SAVED_RECORD:
            return {
                ...state,
                recordSaved: {
                    status: state.recordSaved.status
                }
            };
        case ActionConstants.LOAD_RECORD_PENDING:
            return {
                ...state,
                recordLoaded: {
                    ...state.recordLoaded,
                    status: ACTION_STATUS.PENDING
                }
            };
        case ActionConstants.LOAD_RECORD_SUCCESS:
            return {
                ...state,
                recordLoaded: {
                    status: ACTION_STATUS.SUCCESS,
                    record: action.record,
                    error: ''
                }
            };
        case ActionConstants.LOAD_RECORD_ERROR:
            return {
                ...state,
                recordLoaded: {
                    status: ACTION_STATUS.ERROR,
                    error: action.error
                }
            };
        case ActionConstants.UNLOAD_RECORD:
            return {
                ...state,
                recordLoaded: {}
            };
        case ActionConstants.DELETE_RECORD_PENDING:
            return {
                ...state,
                recordDeleted: {
                    status: ACTION_STATUS.PENDING,
                    key: action.key
                }
            };
        case ActionConstants.DELETE_RECORD_SUCCESS:
            return {
                ...state,
                recordDeleted: {
                    status: ACTION_STATUS.SUCCESS,
                    record: action.record,
                    error: ''
                }
            };
        case ActionConstants.DELETE_RECORD_ERROR:
            return {
                ...state,
                recordDeleted: {
                    status: ACTION_STATUS.ERROR,
                    record: action.record,
                    error: action.error
                }
            };
        default:
            return state;
    }
}