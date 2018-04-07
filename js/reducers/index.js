import {combineReducers} from "redux";
import UserReducer from "./UserReducer";
import UsersReducer from "./UsersReducer";
import AuthReducer from "./AuthReducer";
import InstitutionsReducer from "./InstitutionsReducer";
import InstitutionReducer from "./InstitutionReducer";
import RecordReducer from "./RecordReducer";
import RecordsReducer from "./RecordsReducer";
import RouterReducer from "./RouterReducer";
import HistoryReducer from "./HistoryReducer";
import * as ActionConstants from "../constants/ActionConstants";

const rootReducer = (state, action) => {
    if (action.type === ActionConstants.UNAUTH_USER) {
        state = undefined
    }
    return appReducer(state, action);
};

const appReducer = combineReducers({
    auth: AuthReducer,
    user: UserReducer,
    users: UsersReducer,
    record: RecordReducer,
    router: RouterReducer,
    records: RecordsReducer,
    history: HistoryReducer,
    institution: InstitutionReducer,
    institutions: InstitutionsReducer
});

export default rootReducer;