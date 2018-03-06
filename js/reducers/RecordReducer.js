import * as ActionConstants from "../constants/ActionConstants";
import {ACTION_STATUS} from "../constants/DefaultConstants";

const initialState = {
    institutionPatients: {}
};

export default function (state = initialState, action) {
    switch (action.type) {
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
                    patients: action.institutionPatients,
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