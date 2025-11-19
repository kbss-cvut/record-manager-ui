import * as ActionConstants from "../constants/ActionConstants";
import { HttpHeaders, ROLE } from "../constants/DefaultConstants";
import { axiosBackend } from "./index";
import { API_URL } from "../../config";
import { asyncError, asyncRequest, asyncSuccess, showServerResponseErrorMessage } from "./AsyncActionUtils";
import { extractLastPageNumber, fileDownload, paramsSerializer } from "../utils/Utils";
import { publishMessage } from "./MessageActions";
import { infoMessage, successMessage } from "../model/Message";
import { hasRole } from "../utils/RoleUtils.js";

export function loadRecordsByInstitution(institutionKey) {
  return loadRecords({ institution: institutionKey });
}

export function loadRecords(params = {}) {
  return function (dispatch, getState) {
    const currentUser = getState().auth.user;
    if (
      !hasRole(currentUser, ROLE.READ_ALL_RECORDS) &&
      hasRole(currentUser, ROLE.READ_ORGANIZATION_RECORDS) &&
      currentUser?.institution
    ) {
      params.institution = currentUser.institution.key;
    }
    dispatch(loadRecordsPending());
    return axiosBackend
      .get(`${API_URL}/rest/records`, {
        params,
        paramsSerializer,
      })
      .then((response) => {
        dispatch(loadRecordsSuccess(response.data, extractLastPageNumber(response)));
      })
      .catch((error) => {
        dispatch(loadRecordsError(error.response.data));
        dispatch(showServerResponseErrorMessage(error, "records.loading-error"));
      });
  };
}

export function loadRecordsPending() {
  return asyncRequest(ActionConstants.LOAD_RECORDS_PENDING);
}

export function loadRecordsSuccess(records, pageCount) {
  return {
    type: ActionConstants.LOAD_RECORDS_SUCCESS,
    records,
    pageCount,
  };
}

export function loadRecordsError(error) {
  return asyncError(ActionConstants.LOAD_RECORDS_ERROR, error);
}

export function exportRecords(exportType, params = {}) {
  return (dispatch, getState) => {
    dispatch(asyncRequest(ActionConstants.EXPORT_RECORDS_PENDING));
    const currentUser = getState().auth.user;
    if (
      !hasRole(currentUser, ROLE.READ_ALL_RECORDS) &&
      hasRole(currentUser, ROLE.READ_ORGANIZATION_RECORDS) &&
      currentUser?.institution
    ) {
      params.institution = currentUser.institution.key;
    }
    return axiosBackend
      .get(`${API_URL}/rest/records/export`, {
        params,
        paramsSerializer,
        headers: {
          accept: exportType.mediaType,
        },
        responseType: "arraybuffer",
      })
      .then((resp) => {
        const disposition = resp.headers[HttpHeaders.CONTENT_DISPOSITION];
        const filenameMatch = disposition ? disposition.match(/filename="(.+\..+)"/) : null;
        const fileName = filenameMatch ? filenameMatch[1] : "records" + exportType.fileExtension;
        fileDownload(resp.data, fileName, exportType.mediaType);
        return dispatch(asyncSuccess(ActionConstants.EXPORT_RECORDS_SUCCESS));
      })
      .catch((error) => {
        dispatch(asyncError(ActionConstants.EXPORT_RECORDS_ERROR, error.response.data));
      });
  };
}

export function publishRecords(params = {}) {
  return (dispatch, getState) => {
    dispatch(asyncRequest(ActionConstants.PUBLISH_RECORDS_PENDING));
    const currentUser = getState().auth.user;
    if (hasRole(currentUser, ROLE.PUBLISH_RECORDS) && currentUser.institution) {
      params.institution = currentUser.institution.key;
    }
    return axiosBackend
      .post(`${API_URL}/rest/records/publish`, null, {
        params,
        paramsSerializer,
      })
      .then((resp) => {
        dispatch(asyncSuccess(ActionConstants.PUBLISH_RECORDS_SUCCESS));
        dispatch(loadRecords());
        if (resp.data.importedCount < resp.data.totalCount) {
          dispatch(
            publishMessage(
              infoMessage("records.import.partialSuccess.message", {
                importedCount: resp.data.importedCount,
                totalCount: resp.data.totalCount,
              }),
            ),
          );
        } else {
          dispatch(
            publishMessage(
              successMessage("records.import.success.message", { importedCount: resp.data.importedCount }),
            ),
          );
        }
      })
      .catch((error) => {
        dispatch(asyncError(ActionConstants.PUBLISH_RECORDS_ERROR, error.response?.data || error.message));
        dispatch(showServerResponseErrorMessage(error, "records.import.error.message"));
      });
  };
}

export function importRecords(file) {
  return (dispatch) => {
    dispatch(asyncRequest(ActionConstants.IMPORT_RECORDS_PENDING));

    const formData = new FormData();
    formData.append("file", file);

    let apiUrl = `${API_URL}/rest/records/import`;

    return axiosBackend
      .post(apiUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((resp) => {
        dispatch(asyncSuccess(ActionConstants.IMPORT_RECORDS_SUCCESS));
        dispatch(loadRecords());
        if (resp.data.importedCount < resp.data.totalCount) {
          dispatch(
            publishMessage(
              infoMessage("records.import.partialSuccess.message", {
                importedCount: resp.data.importedCount,
                totalCount: resp.data.totalCount,
              }),
            ),
          );
        } else {
          dispatch(
            publishMessage(
              successMessage("records.import.success.message", { importedCount: resp.data.importedCount }),
            ),
          );
        }
      })
      .catch((error) => {
        dispatch(asyncError(ActionConstants.IMPORT_RECORDS_ERROR, error.response?.data || error.message));
        dispatch(showServerResponseErrorMessage(error, "records.import.error.message"));
      });
  };
}

export function loadRecordsPhases() {
  return function (dispatch) {
    dispatch(loadRecordsPhasesPending());
    return axiosBackend
      .get(`${API_URL}/rest/records/used-record-phases`)
      .then((response) => {
        dispatch(loadRecordsPhasesSuccess(response.data));
      })
      .catch((error) => {
        dispatch(loadRecordsPhasesError(error.response.data));
      });
  };
}

export function loadAllowedRejectReason() {
  return function (dispatch) {
    dispatch(loadAllowedRejectReasonPending());
    return axiosBackend
      .get(`${API_URL}/rest/records/allowedRejectReason`)
      .then((response) => {
        dispatch(loadAllowedRejectReasonSuccess(response.data));
      })
      .catch((error) => {
        dispatch(loadAllowedRejectReasonError(error.response.data));
      });
  };
}

export function loadAllowedRejectReasonSuccess(isAllowedRejectReason) {
  return {
    type: ActionConstants.LOAD_ALLOWED_REJECT_REASON_SUCCESS,
    isAllowedRejectReason,
  };
}

export function loadAllowedRejectReasonError(error) {
  return asyncError(ActionConstants.LOAD_ALLOWED_REJECT_REASON_ERROR, error);
}

export function loadAllowedRejectReasonPending() {
  return asyncRequest(ActionConstants.LOAD_ALLOWED_REJECT_REASON_PENDING);
}

export function loadRecordsPhasesPending() {
  return asyncRequest(ActionConstants.LOAD_RECORDS_PHASES_PENDING);
}

export function loadRecordsPhasesSuccess(phases) {
  return {
    type: ActionConstants.LOAD_RECORDS_PHASES_SUCCESS,
    phases,
  };
}

export function loadRecordsPhasesError(error) {
  return asyncError(ActionConstants.LOAD_RECORDS_PHASES_ERROR, error);
}
