import * as ActionConstants from "../constants/ActionConstants";
import {axiosBackend} from "./index";
import {API_URL} from '../../config';
import {publishMessage} from "./MessageActions";
import {errorMessage} from "../model/Message";

export function loadInstitutions() {
    return function (dispatch) {
        dispatch(loadInstitutionsPending());
        return axiosBackend.get(`${API_URL}/rest/institutions`).then((response) => {
            dispatch(loadInstitutionsSuccess(response.data));
        }).catch((error) => {
            dispatch(loadInstitutionsError(error.response.data));
            dispatch(publishMessage(errorMessage('institutions.loading-error', {error: error.response.data.message})));
        });
    }
}

export function loadInstitutionsPending() {
    return {
        type: ActionConstants.LOAD_INSTITUTIONS_PENDING
    }
}

export function loadInstitutionsSuccess(institutions) {
    return {
        type: ActionConstants.LOAD_INSTITUTIONS_SUCCESS,
        institutions
    }
}

export function loadInstitutionsError(error) {
    return {
        type: ActionConstants.LOAD_INSTITUTIONS_ERROR,
        error
    }
}