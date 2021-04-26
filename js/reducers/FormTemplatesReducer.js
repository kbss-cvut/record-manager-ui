import * as ActionConstants from "../constants/ActionConstants";
import {ACTION_STATUS} from "../constants/DefaultConstants";

const initialState = {
    formTemplatesLoaded: {}
};

export default function (state = initialState, action) {
    switch (action.type) {
        case ActionConstants.LOAD_FORM_TEMPLATES_PENDING:
            return {
                ...state,
                formTemplatesLoaded: {
                    ...state.formTemplatesLoaded,
                    status: ACTION_STATUS.PENDING
                }
            };
        case ActionConstants.LOAD_FORM_TEMPLATES_SUCCESS:
            return {
                ...state,
                formTemplatesLoaded: {
                    status: ACTION_STATUS.SUCCESS,
                    formTemplates: action.formTemplates,
                    error: ''
                }
            };
        case ActionConstants.LOAD_FORM_TEMPLATES_ERROR:
            return {
                ...state,
                formTemplatesLoaded: {
                    status: ACTION_STATUS.ERROR,
                    error: action.error
                }
            };
        default:
            return state;
    }
}