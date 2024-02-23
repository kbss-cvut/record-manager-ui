import {DISMISS_MESSAGE, IMPERSONATE_LOGOUT_SUCCESS, PUBLISH_MESSAGE, UNAUTH_USER} from "../constants/ActionConstants";
import {userAuthPending} from "../actions/AuthActions";

export default function messages(state = [], action) {
    switch (action.type) {
        case PUBLISH_MESSAGE:
            return [...state, action.message];
        case DISMISS_MESSAGE: {
            const newArr = state.slice(0);
            newArr.splice(newArr.indexOf(action.message), 1);
            return newArr;
        }
        case userAuthPending:
        case UNAUTH_USER: // Intentional fall-through
        case IMPERSONATE_LOGOUT_SUCCESS: // Intentional fall-through
            return [];
        default:
            return state;
    }
}