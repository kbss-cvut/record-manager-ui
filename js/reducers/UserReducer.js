import * as ActionConstants from "../constants/ActionConstants";
import {ACTION_STATUS} from "../constants/DefaultConstants";

const initialState = {
    userSaved: {},
    userDeleted: {},
    userLoaded: {},
    institutionMembers: {},
    passwordChange: {},
    generatedUsername: {},
    invitationSent: {},
    impersonation: {},
    invitationDelete: {}
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
                    ...state.institutionMembers,
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
        case ActionConstants.UNLOAD_INSTITUTION_MEMBERS:
            return {
                ...state,
                institutionMembers: {}
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
        case ActionConstants.GENERATE_USERNAME_PENDING:
            return {
                ...state,
                generatedUsername: {
                    status: ACTION_STATUS.PENDING
                }
            };
        case ActionConstants.GENERATE_USERNAME_SUCCESS:
            return {
                ...state,
                generatedUsername: {
                    status: ACTION_STATUS.SUCCESS,
                    username: action.generatedUsername
                }
            };
        case ActionConstants.SEND_INVITATION_PENDING:
            return {
                ...state,
                invitationSent: {
                    status: ACTION_STATUS.PENDING,
                    username: action.username
                }
            };
        case ActionConstants.SEND_INVITATION_SUCCESS:
            return {
                ...state,
                invitationSent: {
                    status: ACTION_STATUS.SUCCESS,
                    username: action.username,
                    error: ''
                }
            };
        case ActionConstants.SEND_INVITATION_ERROR:
            return {
                ...state,
                invitationSent: {
                    status: ACTION_STATUS.ERROR,
                    error: action.error
                }
            };
        case ActionConstants.INVITATION_OPTION_DELETE_PENDING:
            return {
                ...state,
                invitationDelete: {
                    status: ACTION_STATUS.PENDING,
                    username: action.username
                }
            };
        case ActionConstants.INVITATION_OPTION_DELETE_SUCCESS:
            return {
                ...state,
                invitationDelete: {
                    status: ACTION_STATUS.SUCCESS,
                    username: action.username,
                    error: ''
                }
            };
        case ActionConstants.INVITATION_OPTION_DELETE_ERROR:
            return {
                ...state,
                invitationDelete: {
                    status: ACTION_STATUS.ERROR,
                    error: action.error
                }
            };
        case ActionConstants.IMPERSONATE_PENDING:
            return {
                ...state,
                impersonation: {
                    status: ACTION_STATUS.PENDING
                }
            };
        case ActionConstants.IMPERSONATE_SUCCESS:
            return {
                ...state,
                impersonation: {
                    status: ACTION_STATUS.SUCCESS,
                    username: action.username
                }
            };
        case ActionConstants.IMPERSONATE_ERROR:
            return {
                ...state,
                impersonation: {
                    status: ACTION_STATUS.ERROR,
                    error: action.error
                }
            };
        default:
            return state;
    }
}