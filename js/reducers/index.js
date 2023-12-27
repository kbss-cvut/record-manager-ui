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
import StatisticsReducer from "./StatisticsReducer";
import IntlReducer from './IntlReducer';
import FormTemplatesReducer from "./FormTemplatesReducer";
import MessageReducer from "./MessageReducer";

const rootReducer = (state, action) => {
    if (action.type === ActionConstants.UNAUTH_USER) {
        state = undefined
    }
    return appReducer(state, action);
};

const appReducer = combineReducers({
    intl: IntlReducer,
    auth: AuthReducer,
    user: UserReducer,
    users: UsersReducer,
    record: RecordReducer,
    router: RouterReducer,
    records: RecordsReducer,
    formTemplates: FormTemplatesReducer,
    history: HistoryReducer,
    messages: MessageReducer,
    statistics: StatisticsReducer,
    institution: InstitutionReducer,
    institutions: InstitutionsReducer
});

export default rootReducer;