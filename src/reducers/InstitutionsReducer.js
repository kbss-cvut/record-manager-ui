import * as ActionConstants from "../constants/ActionConstants";
import {ACTION_STATUS} from "../constants/DefaultConstants";

const initialState = {
    institutionsLoaded: {}
};

export default function (state = initialState, action) {
    switch (action.type) {
        case ActionConstants.LOAD_INSTITUTIONS_PENDING:
            return {
                ...state,
                institutionsLoaded: {
                    ...state.institutionsLoaded,
                    status: ACTION_STATUS.PENDING
                }
            };
        case ActionConstants.LOAD_INSTITUTIONS_SUCCESS:
            return {
                ...state,
                institutionsLoaded: {
                    status: ACTION_STATUS.SUCCESS,
                    institutions: action.institutions,
                    error: ''
                }
            };
        case ActionConstants.LOAD_INSTITUTIONS_ERROR:
            return {
                ...state,
                institutionsLoaded: {
                    status: ACTION_STATUS.ERROR,
                    error: action.error
                }
            };
        default:
            return state;
    }
}