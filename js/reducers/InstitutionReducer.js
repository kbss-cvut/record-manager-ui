import * as ActionConstants from "../constants/ActionConstants";
import {ACTION_STATUS} from "../constants/DefaultConstants";

const initialState = {
    institutionDeleted: {},
    institutionLoaded: {},
    institutionSaved: {}
};

export default function (state = initialState, action) {
    switch (action.type) {
        case ActionConstants.SAVE_INSTITUTION_PENDING:
            return {
                ...state,
                institutionSaved: {
                    status: ACTION_STATUS.PENDING
                }
            };
        case ActionConstants.SAVE_INSTITUTION_SUCCESS:
            return {
                ...state,
                institutionSaved: {
                    actionFlag: action.actionFlag,
                    status: ACTION_STATUS.SUCCESS,
                    institution: {
                        ...action.institution,
                        key: action.key
                    },
                    error: ''
                }
            };
        case ActionConstants.SAVE_INSTITUTION_ERROR:
            return {
                ...state,
                institutionSaved: {
                    actionFlag: action.actionFlag,
                    status: ACTION_STATUS.ERROR,
                    institution: action.institution,
                    error: action.error
                }
            };
        case ActionConstants.UNLOAD_SAVED_INSTITUTION:
            return {
                ...state,
                institutionSaved: {
                    status: state.institutionSaved.status
                }
            };
        case ActionConstants.DELETE_INSTITUTION_PENDING:
            return {
                ...state,
                institutionDeleted: {
                    status: ACTION_STATUS.PENDING,
                    key: action.key
                }
            };
        case ActionConstants.DELETE_INSTITUTION_SUCCESS:
            return {
                ...state,
                institutionDeleted: {
                    status: ACTION_STATUS.SUCCESS,
                    institution: action.institution,
                    error: ''
                }
            };
        case ActionConstants.DELETE_INSTITUTION_ERROR:
            return {
                ...state,
                institutionDeleted: {
                    status: ACTION_STATUS.ERROR,
                    institution: action.institution,
                    error: action.error
                }
            };
        case ActionConstants.LOAD_INSTITUTION_PENDING:
            return {
                ...state,
                institutionLoaded: {
                    ...state.institutionLoaded,
                    status: ACTION_STATUS.PENDING
                }
            };
        case ActionConstants.LOAD_INSTITUTION_SUCCESS:
            return {
                ...state,
                institutionLoaded: {
                    status: ACTION_STATUS.SUCCESS,
                    institution: action.institution,
                    error: ''
                }
            };
        case ActionConstants.LOAD_INSTITUTION_ERROR:
            return {
                ...state,
                institutionLoaded: {
                    status: ACTION_STATUS.ERROR,
                    error: action.error
                }
            };
        case ActionConstants.UNLOAD_INSTITUTION:
            return {
                ...state,
                institutionLoaded: {}
            };
        default:
            return state;
    }
}