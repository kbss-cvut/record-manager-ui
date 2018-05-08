import * as ActionConstants from "../constants/ActionConstants";
import {ACTION_STATUS} from "../constants/DefaultConstants";
import without from 'lodash/without';

const initialState = {
    institutionPatients: {},
    recordDeleted: {},
    recordLoaded: {},
    recordSaved: {},
    recordsDeleting: [],
    formgen: {}
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
                },
                recordsDeleting: state.recordsDeleting.concat(action.key)
            };
        case ActionConstants.DELETE_RECORD_SUCCESS:
            return {
                ...state,
                recordDeleted: {
                    status: ACTION_STATUS.SUCCESS,
                    record: action.record,
                    error: ''
                },
                recordsDeleting: without(state.recordsDeleting, action.key)
            };
        case ActionConstants.DELETE_RECORD_ERROR:
            return {
                ...state,
                recordDeleted: {
                    status: ACTION_STATUS.ERROR,
                    record: action.record,
                    error: action.error
                },
                recordsDeleting: without(state.recordsDeleting, action.key)
            };
        case ActionConstants.LOAD_FORMGEN_PENDING:
            return {
                ...state,
                formgen: {
                    status: ACTION_STATUS.PENDING,
                    error: ''
                }
            };
        case ActionConstants.LOAD_FORMGEN_SUCCESS:
            return {
                ...state,
                formgen: {
                    status: ACTION_STATUS.SUCCESS,
                    error: ''
                }
            };
        case ActionConstants.LOAD_FORMGEN_ERROR:
            return {
                ...state,
                formgen: {
                    status: ACTION_STATUS.ERROR,
                    error: action.error
                }
            };
        default:
            return state;
    }
}