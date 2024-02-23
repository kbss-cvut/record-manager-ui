import * as ActionConstants from "../constants/ActionConstants";
import {ACTION_FLAG} from "../constants/DefaultConstants";
import {axiosBackend} from "./index";
import * as Utils from "../utils/Utils";
import {loadRecords} from "./RecordsActions";
import {API_URL} from '../../config';
import {publishMessage} from "./MessageActions";
import {errorMessage, successMessage} from "../model/Message";
import {asyncError, asyncRequest, asyncSuccess, showServerResponseErrorMessage} from "./AsyncActionUtils";

export function deleteRecord(record) {
    return function (dispatch) {
        dispatch(deleteRecordPending(record.key));
        return axiosBackend.delete(`${API_URL}/rest/records/${record.key}`, {
            ...record
        }).then(() => {
            dispatch(loadRecords());
            dispatch(deleteRecordSuccess(record, record.key));
            dispatch(publishMessage(successMessage("record.delete-success")));
        }).catch((error) => {
            dispatch(deleteRecordError(error.response.data, record, record.key));
            dispatch(showServerResponseErrorMessage(error, 'record.delete-error'));
        });
    }
}

export function deleteRecordPending(key) {
    return {
        type: ActionConstants.DELETE_RECORD_PENDING,
        key
    }
}

export function deleteRecordSuccess(record, key) {
    return {
        type: ActionConstants.DELETE_RECORD_SUCCESS,
        record,
        key
    }
}

export function deleteRecordError(error, record, key) {
    return {
        type: ActionConstants.DELETE_RECORD_ERROR,
        error,
        record,
        key
    }
}

export function loadRecord(key) {
    return function (dispatch) {
        dispatch(loadRecordPending());
        return axiosBackend.get(`${API_URL}/rest/records/${key}`).then((response) => {
            dispatch(loadRecordSuccess(response.data));
        }).catch((error) => {
            dispatch(loadRecordError(error.response.data));
            dispatch(showServerResponseErrorMessage(error, 'record.load-error'));
        });
    }
}

export function loadRecordPending() {
    return {
        type: ActionConstants.LOAD_RECORD_PENDING
    }
}

export function loadRecordSuccess(record) {
    return {
        type: ActionConstants.LOAD_RECORD_SUCCESS,
        record
    }
}

export function loadRecordError(error) {
    return {
        type: ActionConstants.LOAD_RECORD_ERROR,
        error
    }
}

export function unloadRecord() {
    return {
        type: ActionConstants.UNLOAD_RECORD
    }
}

export function createRecord(record) {
    return function (dispatch, getState) {
        dispatch(saveRecordPending(ACTION_FLAG.CREATE_ENTITY));
        return axiosBackend.post(`${API_URL}/rest/records`, {
            ...record
        }).then((response) => {
            const key = Utils.extractKeyFromLocationHeader(response);
            dispatch(saveRecordSuccess(record, key, ACTION_FLAG.CREATE_ENTITY));
            dispatch(loadRecords());
            dispatch(publishMessage(successMessage("record.save-success")));
        }).catch((error) => {
            dispatch(saveRecordError(error.response.data, record, ACTION_FLAG.CREATE_ENTITY));
            dispatch(publishMessage(errorMessage('record.save-error', {error: getState().intl.messages[error.response.data.messageId]})));
        });
    }
}

export function updateRecord(record) {
    return function (dispatch, getState) {
        dispatch(saveRecordPending(ACTION_FLAG.UPDATE_ENTITY));
        return axiosBackend.put(`${API_URL}/rest/records/${record.key}`, {
            ...record
        }).then(() => {
            dispatch(saveRecordSuccess(record, null, ACTION_FLAG.UPDATE_ENTITY));
            dispatch(loadRecords());
            dispatch(publishMessage(successMessage("record.save-success")));
        }).catch((error) => {
            dispatch(saveRecordError(error.response.data, record, ACTION_FLAG.UPDATE_ENTITY));
            dispatch(publishMessage(errorMessage('record.save-error', {error: getState().intl.messages[error.response.data.messageId]})));
        });
    }
}

export function saveRecordPending(actionFlag) {
    return {
        type: ActionConstants.SAVE_RECORD_PENDING,
        actionFlag
    }
}

export function saveRecordSuccess(record, key, actionFlag) {
    return {
        type: ActionConstants.SAVE_RECORD_SUCCESS,
        record,
        key,
        actionFlag
    }
}

export function saveRecordError(error, record, actionFlag) {
    return {
        type: ActionConstants.SAVE_RECORD_ERROR,
        error,
        record,
        actionFlag
    }
}

export function unloadSavedRecord() {
    return {
        type: ActionConstants.UNLOAD_SAVED_RECORD
    }
}

export function loadFormgen(record) {
    return dispatch => {
        dispatch(asyncRequest(ActionConstants.LOAD_FORMGEN_PENDING));
        return axiosBackend.post(`${API_URL}/rest/formGen`, record)
            .then(resp => {
                dispatch(asyncSuccess(ActionConstants.LOAD_FORMGEN_SUCCESS));
                return Promise.resolve(resp.data);
            })
            .catch(error => {
                dispatch(asyncError(ActionConstants.LOAD_FORMGEN_ERROR, error));
                dispatch(showServerResponseErrorMessage(error, 'record.load-form-error'));
                return Promise.reject(error);
            })
    }
}