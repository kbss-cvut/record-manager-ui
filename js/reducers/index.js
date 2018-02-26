import {combineReducers} from "redux";
import UserReducer from "./UserReducer";
import UsersReducer from "./UsersReducer";

const rootReducer = combineReducers({
    user: UserReducer,
    users: UsersReducer
});

export default rootReducer;