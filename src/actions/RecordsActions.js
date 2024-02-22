import * as ActionConstants from "../constants/ActionConstants";
import {HttpHeaders} from "../constants/DefaultConstants";
import {axiosBackend} from "./index";
import {API_URL} from '../../config';
import {asyncError, asyncRequest, asyncSuccess, showServerResponseErrorMessage} from "./AsyncActionUtils";
import {extractLastPageNumber, fileDownload, paramsSerializer} from "../utils/Utils";
import {publishMessage} from "./MessageActions";
import {infoMessage, successMessage} from "../model/Message";
import {isAdmin} from "../utils/SecurityUtils";

export function loadRecordsByInstitution(institutionKey) {
    return loadRecords({institution: institutionKey});
}

export function loadRecords(params = {}) {
    return function (dispatch, getState) {
        const currentUser = getState().auth.user;
        if (currentUser && !isAdmin(currentUser) && currentUser.institution) {
            params.institution = currentUser.institution.key;
        }
        dispatch(loadRecordsPending());
        return axiosBackend.get(`${API_URL}/rest/records`, {
            params,
            paramsSerializer
        }).then((response) => {
            dispatch(loadRecordsSuccess(response.data, extractLastPageNumber(response)));
        }).catch((error) => {
            dispatch(loadRecordsError(error.response.data));
            dispatch(showServerResponseErrorMessage(error, 'records.loading-error'));
        });
    }
}

export function loadRecordsPending() {
    return asyncRequest(ActionConstants.LOAD_RECORDS_PENDING);
}

export function loadRecordsSuccess(records, pageCount) {
    return {
        type: ActionConstants.LOAD_RECORDS_SUCCESS,
        records,
        pageCount
    }
}

export function loadRecordsError(error) {
    return asyncError(ActionConstants.LOAD_RECORDS_ERROR, error);
}

export function exportRecords(exportType, params = {}) {
    return (dispatch, getState) => {
        dispatch(asyncRequest(ActionConstants.EXPORT_RECORDS_PENDING));
        const currentUser = getState().auth.user;
        if (currentUser && !isAdmin(currentUser) && currentUser.institution) {
            params.institution = currentUser.institution.key;
        }
        return axiosBackend.get(`${API_URL}/rest/records/export`, {
            params,
            paramsSerializer,
            headers: {
                accept: exportType.mediaType
            },
            responseType: 'arraybuffer'
        }).then((resp) => {
            const disposition = resp.headers[HttpHeaders.CONTENT_DISPOSITION];
            const filenameMatch = disposition
                ? disposition.match(/filename="(.+\..+)"/)
                : null;
            const fileName = filenameMatch ? filenameMatch[1] : "records" + exportType.fileExtension;
            fileDownload(resp.data, fileName, exportType.mediaType);
            return dispatch(asyncSuccess(ActionConstants.EXPORT_RECORDS_SUCCESS));
        }).catch((error) => {
            dispatch(asyncError(ActionConstants.EXPORT_RECORDS_ERROR, error.response.data));
        });
    }
}

export function importRecords(file) {
    return (dispatch) => {
        dispatch(asyncRequest(ActionConstants.IMPORT_RECORDS_PENDING));
        return file.text().then(content => {
            return axiosBackend.post(`${API_URL}/rest/records/import`, JSON.parse(content))
        }).then((resp) => {
            dispatch(asyncSuccess(ActionConstants.IMPORT_RECORDS_SUCCESS));
            dispatch(loadRecords());
            if (resp.data.importedCount < resp.data.totalCount) {
                dispatch(publishMessage(infoMessage("records.import.partialSuccess.message", {
                    importedCount: resp.data.importedCount,
                    totalCount: resp.data.totalCount
                })));
            } else {
                dispatch(publishMessage(successMessage("records.import.success.message", {importedCount: resp.data.importedCount})));
            }
        }).catch(error => {
            dispatch(asyncError(ActionConstants.IMPORT_RECORDS_ERROR, error.response.data));
            dispatch(showServerResponseErrorMessage(error, "records.import.error.message"));
        });
    };
}
