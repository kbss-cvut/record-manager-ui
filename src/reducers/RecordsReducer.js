import * as ActionConstants from "../constants/ActionConstants";
import { ACTION_STATUS } from "../constants/DefaultConstants";

const initialState = {
  recordsLoaded: {
    records: [],
    pageCount: 0,
  },
  recordsPhases: {},
  isAllowedRejectReason: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case ActionConstants.LOAD_RECORDS_PENDING:
      return {
        ...state,
        recordsLoaded: {
          ...state.recordsLoaded,
          status: ACTION_STATUS.PENDING,
        },
      };
    case ActionConstants.LOAD_RECORDS_SUCCESS:
      return {
        ...state,
        recordsLoaded: {
          status: ACTION_STATUS.SUCCESS,
          records: action.records || [],
          pageCount: action.pageCount || 0,
          error: "",
        },
      };
    case ActionConstants.LOAD_RECORDS_ERROR:
      return {
        ...state,
        recordsLoaded: {
          status: ACTION_STATUS.ERROR,
          error: action.error,
        },
      };
    case ActionConstants.LOAD_RECORDS_PHASES_PENDING:
      return {
        ...state,
        recordsPhases: {
          ...state.phases,
          status: ACTION_STATUS.PENDING,
        },
      };
    case ActionConstants.LOAD_RECORDS_PHASES_SUCCESS:
      return {
        ...state,
        recordsPhases: {
          status: ACTION_STATUS.SUCCESS,
          data: action.phases,
          error: "",
        },
      };
    case ActionConstants.LOAD_RECORDS_PHASES_ERROR:
      return {
        ...state,
        recordsPhases: {
          status: ACTION_STATUS.ERROR,
          error: action.error,
        },
      };
    case ActionConstants.LOAD_ALLOWED_REJECT_REASON_PENDING:
      return {
        ...state,
        isAllowedRejectReason: {
          status: ACTION_STATUS.PENDING,
          ...state.isAllowedRejectReason,
        },
      };

    case ActionConstants.LOAD_ALLOWED_REJECT_REASON_SUCCESS:
      return {
        ...state,
        isAllowedRejectReason: {
          status: ACTION_STATUS.PENDING,
          data: action.isAllowedRejectReason,
          error: "",
        },
      };
    case ActionConstants.LOAD_ALLOWED_REJECT_REASON_ERROR:
      return {
        ...state,
        isAllowedRejectReason: {
          status: ACTION_STATUS.ERROR,
          error: action.error,
        },
      };

    default:
      return state;
  }
}
