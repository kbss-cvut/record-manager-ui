import * as ActionConstants from "../constants/ActionConstants";
import {getRole} from "../utils/Utils";
import {ACTION_STATUS} from "../constants/DefaultConstants";

const initialState = {
    authenticated: false,
    loggingIn: false,
    isLoaded: false,
    user: {},
};

export default function (state = initialState, action) {
    switch (action.type) {
        case ActionConstants.AUTH_USER_PENDING:
            return {
                ...state,
                loggingIn: true
            };
        case ActionConstants.AUTH_USER_SUCCESS:
            return {
                ...state,
                error: '',
                authenticated: true,
                loggingIn: false
            };
        case ActionConstants.AUTH_USER_ERROR:
            return {
                ...state,
                error: action.error,
                loggingIn: false
            };
        case ActionConstants.LOAD_USER_PROFILE_PENDING:
            return {
                ...state,
                isLoaded: false,
                authenticated: false,
                status: ACTION_STATUS.PENDING
            };
        case ActionConstants.LOAD_USER_PROFILE_SUCCESS:
            return {
                ...state,
                isLoaded: true,
                authenticated: true,
                status: ACTION_STATUS.SUCCESS,
                user: {
                    ...action.user,
                    role: getRole(action.user)
                }
            };
        case ActionConstants.LOAD_USER_PROFILE_ERROR:
            return {
                ...state,
                isLoaded: false,
                authenticated: false,
                status: ACTION_STATUS.ERROR,
                user: {
                    error: action.error
                }
            };
        default:
            return state;
    }
}