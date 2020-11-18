import * as ActionConstants from "../constants/ActionConstants";
import {axiosBackend} from "./index";
import {API_URL} from '../../config';

export function loadFormTypes() {
    return function (dispatch) {
        dispatch(loadFormTypesPending());
        axiosBackend.get(`${API_URL}/rest/formGen/formTypes`).then((response) => {
            dispatch(loadFormTypesSuccess(response.data));
        }).catch((error) => {
            dispatch(loadFormTypesError(error.response.data));
        });
    }
}

export function loadFormTypesPending() {
    return {
        type: ActionConstants.LOAD_FORM_TYPES_PENDING
    }
}

export function loadFormTypesSuccess(formTypes) {
    return {
        type: ActionConstants.LOAD_FORM_TYPES_SUCCESS,
        formTypes
    }
}

export function loadFormTypesError(error) {
    return {
        type: ActionConstants.LOAD_FORM_TYPES_ERROR,
        error
    }
}