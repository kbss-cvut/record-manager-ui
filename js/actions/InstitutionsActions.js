import * as ActionConstants from "../constants/ActionConstants";
import {axiosBackend} from "./index";

export function loadInstitutions() {
    //console.log("Loading all institutions");
    return function (dispatch) {
        dispatch(loadInstitutionsPending());
        axiosBackend.get('rest/institutions').then((response) => {
            dispatch(loadInstitutionsSuccess(response.data));
        }).catch((error) => {
            dispatch(loadInstitutionsError(error.response.data));
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