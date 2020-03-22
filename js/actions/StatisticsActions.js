import {axiosBackend} from "./index";
import {LOAD_STATISTICS_ERROR, LOAD_STATISTICS_PENDING, LOAD_STATISTICS_SUCCESS} from "../constants/ActionConstants";
import {API_URL} from '../../config';

export function loadStatistics() {
    //console.log("Loading statistics: ");
    return function (dispatch) {
        dispatch({type: LOAD_STATISTICS_PENDING});
        axiosBackend.get(`${API_URL}/rest/statistics`).then((response) => {
            dispatch({type: LOAD_STATISTICS_SUCCESS, payload: response.data});
        }).catch((error) => {
            dispatch({type: LOAD_STATISTICS_ERROR, error: error.response.data});
        });
    }
}