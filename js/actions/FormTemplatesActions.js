import * as ActionConstants from "../constants/ActionConstants";
import {axiosBackend} from "./index";
import {API_URL} from '../../config';

export function loadFormTemplates() {
    return function (dispatch) {
        dispatch(loadFormTemplatesPending());
        axiosBackend.get(`${API_URL}/rest/formGen/formTemplates`).then((response) => {
            dispatch(loadFormTemplatesSuccess(response.data));
        }).catch((error) => {
            dispatch(loadFormTemplatesError(error.response.data));
        });
    }
}

export function loadFormTemplatesPending() {
    return {
        type: ActionConstants.LOAD_FORM_TEMPLATES_PENDING
    }
}

export function loadFormTemplatesSuccess(formTemplates) {
    return {
        type: ActionConstants.LOAD_FORM_TEMPLATES_SUCCESS,
        formTemplates
    }
}

export function loadFormTemplatesError(error) {
    return {
        type: ActionConstants.LOAD_FORM_TEMPLATES_ERROR,
        error
    }
}