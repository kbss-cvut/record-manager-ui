import * as ActionConstants from "../constants/ActionConstants";
import {ACTION_STATUS} from "../constants/DefaultConstants";

const initialState = {
    institutionPatients: {},
    recordDeleted: {}
};

export default function (state = initialState, action) {
    switch (action.type) {
        case ActionConstants.DELETE_RECORD_PENDING:
            return {
                ...state,
                recordDeleted: {
                    status: ACTION_STATUS.PENDING,
                    key: action.key
                }
            };
        case ActionConstants.DELETE_RECORD_SUCCESS:
            return {
                ...state,
                recordDeleted: {
                    status: ACTION_STATUS.SUCCESS,
                    record: action.record,
                    error: ''
                }
            };
        case ActionConstants.DELETE_RECORD_ERROR:
            return {
                ...state,
                recordDeleted: {
                    status: ACTION_STATUS.ERROR,
                    record: action.record,
                    error: action.error
                }
            };
        case ActionConstants.LOAD_INSTITUTION_PATIENTS_PENDING:
            return {
                ...state,
                institutionPatients: {
                    status: ACTION_STATUS.PENDING
                }
            };
        case ActionConstants.LOAD_INSTITUTION_PATIENTS_SUCCESS:
            return {
                ...state,
                institutionPatients: {
                    status: ACTION_STATUS.SUCCESS,
                    patients: action.patients,
                    error: ''
                }
            };
        case ActionConstants.LOAD_INSTITUTION_PATIENTS_ERROR:
            return {
                ...state,
                institutionPatients: {
                    status: ACTION_STATUS.ERROR,
                    error: action.error
                }
            };
        default:
            return state;
    }
}