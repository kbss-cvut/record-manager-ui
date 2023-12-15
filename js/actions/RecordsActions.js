import * as ActionConstants from "../constants/ActionConstants";
import {HttpHeaders, ROLE} from "../constants/DefaultConstants";
import {axiosBackend} from "./index";
import {API_URL} from '../../config';
import {asyncError, asyncRequest, asyncSuccess} from "./AsyncActionUtils";
import {fileDownload} from "../utils/Utils";

export function loadRecords(currentUser, institutionKey = null) {
    //console.log("Loading records");
    let urlSuffix = '';
    if (institutionKey) {
        urlSuffix = `?institution=${institutionKey}`;
    } else if (currentUser.role !== ROLE.ADMIN && currentUser.institution) {
        urlSuffix = `?institution=${currentUser.institution.key}`;
    }
    return function (dispatch) {
        dispatch(loadRecordsPending());
        axiosBackend.get(`${API_URL}/rest/records${urlSuffix}`).then((response) => {
            dispatch(loadRecordsSuccess(response.data));
        }).catch((error) => {
            dispatch(loadRecordsError(error.response.data));
        });
    }
}

export function loadRecordsPending() {
    return asyncRequest(ActionConstants.LOAD_RECORDS_PENDING);
}

export function loadRecordsSuccess(records) {
    return {
        type: ActionConstants.LOAD_RECORDS_SUCCESS,
        records
    }
}

export function loadRecordsError(error) {
    return asyncError(ActionConstants.LOAD_RECORDS_ERROR, error);
}

export function exportRecords(exportType, institutionKey) {
    return (dispatch) => {
        dispatch(asyncRequest(ActionConstants.EXPORT_RECORDS_PENDING));
        const urlSuffix = institutionKey ? `?institution=${institutionKey}` : '';
        return axiosBackend.get(`${API_URL}/rest/records/export${urlSuffix}`, {
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