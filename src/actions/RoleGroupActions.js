import { asyncError, asyncRequest, showServerResponseErrorMessage } from "./AsyncActionUtils.js";
import * as ActionConstants from "../constants/ActionConstants.js";
import { axiosBackend } from "./index.js";
import { API_URL } from "../../config/index.js";

export function loadAvailableRoleGroups() {
  return function (dispatch, getState) {
    dispatch(loadRoleGroupsPending());
    return axiosBackend
      .get(`${API_URL}/rest/roleGroups/available`, {})
      .then((response) => {
        dispatch(loadRoleGroupsSuccess(response.data));
      })
      .catch((error) => {
        dispatch(loadRoleGroupsError(Error(error.response.data)));
        dispatch(showServerResponseErrorMessage(error, "roleGroup.loading-error"));
      });
  };
}

export function loadRoleGroupsPending() {
  return asyncRequest(ActionConstants.LOAD_ROLE_GROUPS_PENDING);
}

export function loadRoleGroupsSuccess(roleGroups) {
  return {
    type: ActionConstants.LOAD_ROLE_GROUPS_SUCCESS,
    roleGroups,
  };
}

export function loadRoleGroupsError(error) {
  return asyncError(ActionConstants.LOAD_ROLE_GROUPS_ERROR, error);
}
