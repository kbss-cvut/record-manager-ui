import * as ActionConstants from "../constants/ActionConstants";

const initialState = {
    userSaved: {},
    userLoaded: {},
    usersLoaded: {}
};

export default function (state = initialState, action) {
    switch (action.type) {
        case ActionConstants.SAVE_USER_BEGIN:
            return {
                ...state,
                userSaved: {
                    fetching: true,
                }
            };
        case ActionConstants.SAVE_USER_COMPLETE:
            return {
                ...state,
                userSaved: {
                    actionType: action.actionType,
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
                    actionType: action.actionType,
                    fetching: false,
                    success: false,
                    user: action.user,
                    error: action.error
                }
            };
        case ActionConstants.LOAD_USER_BEGIN:
            return {
                ...state,
                userLoaded: {
                    ...state.userLoaded,
                    fetching: true
                }
            };
        case ActionConstants.LOAD_USER_COMPLETE:
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
        case ActionConstants.LOAD_USERS_BEGIN:
            return {
                ...state,
                usersLoaded: {
                    ...state.usersLoaded,
                    fetching: true,
                }
            };
        case ActionConstants.LOAD_USERS_COMPLETE:
            return {
                ...state,
                usersLoaded: {
                    fetching: false,
                    success: true,
                    users: action.users,
                    error: ''
                }
            };
        case ActionConstants.LOAD_USERS_ERROR:
            return {
                ...state,
                usersLoaded: {
                    fetching: false,
                    success: false,
                    error: action.error
                }
            };

        default:
            return state;
    }
}