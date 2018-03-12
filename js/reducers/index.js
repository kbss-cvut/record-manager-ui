import {combineReducers} from "redux";
import UserReducer from "./UserReducer";
import UsersReducer from "./UsersReducer";
import AuthReducer from "./AuthReducer";
import InstitutionsReducer from "./InstitutionsReducer";
import InstitutionReducer from "./InstitutionReducer";
import RecordReducer from "./RecordReducer";
import RecordsReducer from "./RecordsReducer";

const rootReducer = combineReducers({
    auth: AuthReducer,
    user: UserReducer,
    users: UsersReducer,
    record: RecordReducer,
    records: RecordsReducer,
    institution: InstitutionReducer,
    institutions: InstitutionsReducer
});

export default rootReducer;