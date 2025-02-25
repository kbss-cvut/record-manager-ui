import { ACTION_STATUS } from "../constants/DefaultConstants.js";
import * as ActionConstants from "../constants/ActionConstants.js";

const initialState = {
  roleGroupsLoaded: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case ActionConstants.LOAD_ROLE_GROUPS_PENDING:
      return {
        ...state,
        roleGroupsLoaded: {
          ...state.roleGroupsLoaded,
          status: ACTION_STATUS.PENDING,
        },
      };
    case ActionConstants.LOAD_ROLE_GROUPS_SUCCESS:
      return {
        ...state,
        roleGroupsLoaded: {
          status: ACTION_STATUS.SUCCESS,
          roleGroups: action.roleGroups,
          error: "",
        },
      };
    case ActionConstants.LOAD_ROLE_GROUPS_ERROR:
      return {
        ...state,
        roleGroupsLoaded: {
          status: ACTION_STATUS.ERROR,
          error: action.error,
        },
      };
    default:
      return state;
  }
}
