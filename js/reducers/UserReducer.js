import * as ActionConstants from "../constants/ActionConstants";
import {ACTION_STATUS} from "../constants/DefaultConstants";

const initialState = {
    userSaved: {},
    userDeleted: {},
    userLoaded: {},
    currentUser: {
        isLoaded: false
    },
    institutionMembers: {},
    passwordChange: {}
};

export default function (state = initialState, action) {
    switch (action.type) {
        case ActionConstants.SAVE_USER_PENDING:
            return {
                ...state,
                userSaved: {
                    status: ACTION_STATUS.PENDING
                }
            };
        case ActionConstants.SAVE_USER_SUCCESS:
            return {
                ...state,
                userSaved: {
                    actionFlag: action.actionFlag,
                    status: ACTION_STATUS.SUCCESS,
                    user: action.user,
                    error: ''
                }
            };
        case ActionConstants.SAVE_USER_ERROR:
            return {
                ...state,
                userSaved: {
                    actionFlag: action.actionFlag,
                    status: ACTION_STATUS.ERROR,
                    user: action.user,
                    error: action.error
                }
            };
        case ActionConstants.UNLOAD_SAVED_USER:
            return {
                ...state,
                userSaved: {
                    status: state.userSaved.status
                }
            };
        case ActionConstants.DELETE_USER_PENDING:
            return {
                ...state,
                userDeleted: {
                    status: ACTION_STATUS.PENDING,
                    username: action.username
                }
            };
        case ActionConstants.DELETE_USER_SUCCESS:
            return {
                ...state,
                userDeleted: {
                    status: ACTION_STATUS.SUCCESS,
                    user: action.user,
                    error: ''
                }
            };
        case ActionConstants.DELETE_USER_ERROR:
            return {
                ...state,
                userDeleted: {
                    status: ACTION_STATUS.ERROR,
                    user: action.user,
                    error: action.error
                }
            };
        case ActionConstants.LOAD_USER_PENDING:
            return {
                ...state,
                userLoaded: {
                    ...state.userLoaded,
                    status: ACTION_STATUS.PENDING
                }
            };
        case ActionConstants.LOAD_USER_SUCCESS:
            return {
                ...state,
                userLoaded: {
                    status: ACTION_STATUS.SUCCESS,
                    user: action.user,
                    error: ''
                }
            };
        case ActionConstants.LOAD_USER_ERROR:
            return {
                ...state,
                userLoaded: {
                    status: ACTION_STATUS.ERROR,
                    error: action.error
                }
            };
        case ActionConstants.UNLOAD_USER:
            return {
                ...state,
                userLoaded: {}
            };
        case ActionConstants.LOAD_INSTITUTION_MEMBERS_PENDING:
            return {
                ...state,
                institutionMembers: {
                    status: ACTION_STATUS.PENDING
                }
            };
        case ActionConstants.LOAD_INSTITUTION_MEMBERS_SUCCESS:
            return {
                ...state,
                institutionMembers: {
                    status: ACTION_STATUS.SUCCESS,
                    members: action.members,
                    error: ''
                }
            };
        case ActionConstants.LOAD_INSTITUTION_MEMBERS_ERROR:
            return {
                ...state,
                institutionMembers: {
                    status: ACTION_STATUS.ERROR,
                    error: action.error
                }
            };
        case ActionConstants.PASSWORD_CHANGE_PENDING:
            return {
                ...state,
                passwordChange: {
                    status: ACTION_STATUS.PENDING
                }
            };
        case ActionConstants.PASSWORD_CHANGE_SUCCESS:
            return {
                ...state,
                passwordChange: {
                    status: ACTION_STATUS.SUCCESS,
                    error: ''
                }
            };
        case ActionConstants.PASSWORD_CHANGE_ERROR:
            return {
                ...state,
                passwordChange: {
                    status: ACTION_STATUS.ERROR,
                    error: action.error
                }
            };
        default:
            return state;
    }
}