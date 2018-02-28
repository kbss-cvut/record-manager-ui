import * as ActionConstants from "../constants/ActionConstants";
import {ACTION_STATUS} from "../constants/DefaultConstants";
import {getRole, isAdmin} from "../utils/Utils";

const initialState = {
    userSaved: {},
    userDeleted: {},
    userLoaded: {},
    currentUser: {
        isLoaded: false
    }
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
        default:
            return state;
    }
}