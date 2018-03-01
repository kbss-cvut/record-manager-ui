import * as ActionConstants from "../constants/ActionConstants";
import {ACTION_STATUS} from "../constants/DefaultConstants";
import {getRole, isAdmin} from "../utils/Utils";

const initialState = {
    institutionDeleted: {}
};

export default function (state = initialState, action) {
    switch (action.type) {
        case ActionConstants.DELETE_INSTITUTION_PENDING:
            return {
                ...state,
                institutionDeleted: {
                    status: ACTION_STATUS.PENDING,
                    key: action.key
                }
            };
        case ActionConstants.DELETE_INSTITUTION_SUCCESS:
            return {
                ...state,
                institutionDeleted: {
                    status: ACTION_STATUS.SUCCESS,
                    institution: action.institution,
                    error: ''
                }
            };
        case ActionConstants.DELETE_INSTITUTION_ERROR:
            return {
                ...state,
                institutionDeleted: {
                    status: ACTION_STATUS.ERROR,
                    institution: action.institution,
                    error: action.error
                }
            };
        default:
            return state;
    }
}