import {combineReducers} from "redux";
import UserReducer from "./UserReducer";
import UsersReducer from "./UsersReducer";
import AuthReducer from "./AuthReducer";
import InstitutionsReducer from "./InstitutionsReducer";
import InstitutionReducer from "./InstitutionReducer";

const rootReducer = combineReducers({
    auth: AuthReducer,
    user: UserReducer,
    users: UsersReducer,
    institution: InstitutionReducer,
    institutions: InstitutionsReducer
});

export default rootReducer;