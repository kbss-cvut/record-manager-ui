import * as ActionConstants from "../constants/ActionConstants";
import {ACTION_STATUS} from "../constants/DefaultConstants";

const initialState = {
    formTypesLoaded: {}
};

export default function (state = initialState, action) {
    switch (action.type) {
        case ActionConstants.LOAD_FORM_TYPES_PENDING:
            return {
                ...state,
                formTypesLoaded: {
                    ...state.formTypesLoaded,
                    status: ACTION_STATUS.PENDING
                }
            };
        case ActionConstants.LOAD_FORM_TYPES_SUCCESS:
            return {
                ...state,
                formTypesLoaded: {
                    status: ACTION_STATUS.SUCCESS,
                    formTypes: action.formTypes,
                    error: ''
                }
            };
        case ActionConstants.LOAD_FORM_TYPES_ERROR:
            return {
                ...state,
                formTypesLoaded: {
                    status: ACTION_STATUS.ERROR,
                    error: action.error
                }
            };
        default:
            return state;
    }
}