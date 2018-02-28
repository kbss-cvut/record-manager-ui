import {combineReducers} from "redux";
import UserReducer from "./UserReducer";
import UsersReducer from "./UsersReducer";
import AuthReducer from "./AuthReducer";

const rootReducer = combineReducers({
    auth: AuthReducer,
    user: UserReducer,
    users: UsersReducer
});

export default rootReducer;