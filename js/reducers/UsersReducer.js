import * as ActionConstants from "../constants/ActionConstants";
import {ACTION_STATUS} from "../constants/DefaultConstants";

const initialState = {
    usersLoaded: {}
};

export default function (state = initialState, action) {
    switch (action.type) {
        case ActionConstants.LOAD_USERS_PENDING:
            return {
                ...state,
                usersLoaded: {
                    ...state.usersLoaded,
                    status: ACTION_STATUS.PENDING
                }
            };
        case ActionConstants.LOAD_USERS_SUCCESS:
            return {
                ...state,
                usersLoaded: {
                    status: ACTION_STATUS.SUCCESS,
                    users: action.users,
                    error: ''
                }
            };
        case ActionConstants.LOAD_USERS_ERROR:
            return {
                ...state,
                usersLoaded: {
                    status: ACTION_STATUS.ERROR,
                    error: action.error
                }
            };
        default:
            return state;
    }
}