import * as ActionConstants from "../constants/ActionConstants";
import {ROLE} from "../constants/DefaultConstants";
import {axiosBackend} from "./index";

export function loadRecords(currentUser, institutionKey = null) {
    //console.log("Loading records");
    let urlSuffix = '';
    if (institutionKey){
        urlSuffix = `?institution=${institutionKey}`;
    } else if (currentUser.role !== ROLE.ADMIN && currentUser.institution) {
        urlSuffix = `?institution=${currentUser.institution.key}`;
    }
    return function (dispatch) {
        dispatch(loadRecordsPending());
        axiosBackend.get(`rest/records${urlSuffix}`).then((response) => {
            dispatch(loadRecordsSuccess(response.data));
        }).catch((error) => {
            dispatch(loadRecordsError(error.response.data));
        });
    }
}

export function loadRecordsPending() {
    return {
        type: ActionConstants.LOAD_RECORDS_PENDING
    }
}

export function loadRecordsSuccess(records) {
    return {
        type: ActionConstants.LOAD_RECORDS_SUCCESS,
        records
    }
}

export function loadRecordsError(error) {
    return {
        type: ActionConstants.LOAD_RECORDS_ERROR,
        error
    }
}