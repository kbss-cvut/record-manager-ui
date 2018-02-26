import * as ActionConstants from "../constants/ActionConstants";

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
                    fetching: true,
                }
            };
        case ActionConstants.LOAD_USERS_SUCCESS:
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