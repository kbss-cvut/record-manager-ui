import * as ActionConstants from "../constants/ActionConstants";
import {axiosBackend} from "./index";
import {ACTION_FLAG} from "../constants/DefaultConstants";
import * as Utils from "../utils/Utils";
import {loadInstitutions} from "./InstitutionsActions";
import {API_URL} from '../../config';
import {publishMessage} from "./MessageActions";
import {errorMessage, successMessage} from "../model/Message";
import {showServerResponseErrorMessage} from "./AsyncActionUtils";

export function deleteInstitution(institution) {
    return function (dispatch, getState) {
        dispatch(deleteInstitutionPending(institution.key));
        return axiosBackend.delete(`${API_URL}/rest/institutions/${institution.key}`, {
            ...institution
        }).then(() => {
            dispatch(loadInstitutions());
            dispatch(deleteInstitutionSuccess(institution));
            dispatch(publishMessage(successMessage('institution.delete-success')));
        }).catch((error) => {
            dispatch(deleteInstitutionError(error.response.data, institution));
            dispatch(publishMessage(errorMessage('institution.delete-error', {error: getState().intl.messages[error.response.data.messageId]})));
        });
    }
}

export function deleteInstitutionPending(key) {
    return {
        type: ActionConstants.DELETE_INSTITUTION_PENDING,
        key
    }
}

export function deleteInstitutionSuccess(institution) {
    return {
        type: ActionConstants.DELETE_INSTITUTION_SUCCESS,
        institution
    }
}

export function deleteInstitutionError(error, institution) {
    return {
        type: ActionConstants.DELETE_INSTITUTION_ERROR,
        error,
        institution
    }
}

export function loadInstitution(key) {
    //console.log("Loading institution with key: ", key);
    return function (dispatch) {
        dispatch(loadInstitutionPending());
        return axiosBackend.get(`${API_URL}/rest/institutions/${key}`).then((response) => {
            dispatch(loadInstitutionSuccess(response.data));
        }).catch((error) => {
            dispatch(loadInstitutionError(error.response.data));
            dispatch(showServerResponseErrorMessage(error, 'institution.load-error'));
        });
    }
}

export function loadInstitutionPending() {
    return {
        type: ActionConstants.LOAD_INSTITUTION_PENDING
    }
}

export function loadInstitutionSuccess(institution) {
    return {
        type: ActionConstants.LOAD_INSTITUTION_SUCCESS,
        institution
    }
}

export function loadInstitutionError(error) {
    return {
        type: ActionConstants.LOAD_INSTITUTION_ERROR,
        error
    }
}

export function unloadInstitution() {
    return {
        type: ActionConstants.UNLOAD_INSTITUTION
    }
}

export function createInstitution(institution) {
    //console.log("Creating institution: ", institution);
    return function (dispatch) {
        dispatch(saveInstitutionPending(ACTION_FLAG.CREATE_ENTITY));
        return axiosBackend.post(`${API_URL}/rest/institutions`, {
            ...institution
        }).then((response) => {
            const key = Utils.extractKeyFromLocationHeader(response);
            dispatch(saveInstitutionSuccess(institution, key, ACTION_FLAG.CREATE_ENTITY));
            dispatch(loadInstitutions());
            dispatch(publishMessage(successMessage('institution.save-success')));
        }).catch((error) => {
            dispatch(saveInstitutionError(error.response.data, institution, ACTION_FLAG.CREATE_ENTITY));
            dispatch(showServerResponseErrorMessage(error, 'institution.save-error'));
        });
    }
}

export function updateInstitution(institution) {
    //console.log("Updating institution: ", institution);
    return function (dispatch) {
        dispatch(saveInstitutionPending(ACTION_FLAG.UPDATE_ENTITY));
        return axiosBackend.put(`${API_URL}/rest/institutions/${institution.key}`, {
            ...institution
        }).then(() => {
            dispatch(saveInstitutionSuccess(institution, null, ACTION_FLAG.UPDATE_ENTITY));
            dispatch(loadInstitutions());
            dispatch(publishMessage(successMessage('institution.save-success')));
        }).catch((error) => {
            dispatch(saveInstitutionError(error.response.data, institution, ACTION_FLAG.UPDATE_ENTITY));
            dispatch(showServerResponseErrorMessage(error, 'institution.save-error'));
        });
    }
}

export function saveInstitutionPending(actionFlag) {
    return {
        type: ActionConstants.SAVE_INSTITUTION_PENDING,
        actionFlag
    }
}

export function saveInstitutionSuccess(institution, key, actionFlag) {
    return {
        type: ActionConstants.SAVE_INSTITUTION_SUCCESS,
        institution,
        key,
        actionFlag
    }
}

export function saveInstitutionError(error, institution, actionFlag) {
    return {
        type: ActionConstants.SAVE_INSTITUTION_ERROR,
        error,
        institution,
        actionFlag
    }
}

export function unloadSavedInstitution() {
    return {
        type: ActionConstants.UNLOAD_SAVED_INSTITUTION
    }
}