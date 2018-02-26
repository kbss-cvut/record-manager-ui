import * as ActionConstants from "../constants/ActionConstants";

const initialState = {
    userSaved: {},
    userDeleted: {},
    userLoaded: {},
};

export default function (state = initialState, action) {
    switch (action.type) {
        case ActionConstants.SAVE_USER_PENDING:
            return {
                ...state,
                userSaved: {
                    fetching: true,
                }
            };
        case ActionConstants.SAVE_USER_SUCCESS:
            return {
                ...state,
                userSaved: {
                    actionFlag: action.actionFlag,
                    fetching: false,
                    success: true,
                    user: action.user,
                    error: ''
                }
            };
        case ActionConstants.SAVE_USER_ERROR:
            return {
                ...state,
                userSaved: {
                    actionFlag: action.actionFlag,
                    fetching: false,
                    success: false,
                    user: action.user,
                    error: action.error
                }
            };
        case ActionConstants.DELETE_USER_PENDING:
            return {
                ...state,
                userDeleted: {
                    fetching: true,
                    username: action.username
                }
            };
        case ActionConstants.DELETE_USER_SUCCESS:
            return {
                ...state,
                userDeleted: {
                    fetching: false,
                    success: true,
                    user: action.user,
                    error: ''
                }
            };
        case ActionConstants.DELETE_USER_ERROR:
            return {
                ...state,
                userDeleted: {
                    fetching: false,
                    success: false,
                    user: action.user,
                    error: action.error
                }
            };
        case ActionConstants.LOAD_USER_PENDING:
            return {
                ...state,
                userLoaded: {
                    ...state.userLoaded,
                    fetching: true
                }
            };
        case ActionConstants.LOAD_USER_SUCCESS:
            return {
                ...state,
                userLoaded: {
                    fetching: false,
                    success: true,
                    user: action.user,
                    error: ''
                }
            };
        case ActionConstants.LOAD_USER_ERROR:
            return {
                ...state,
                userLoaded: {
                    fetching: false,
                    success: false,
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