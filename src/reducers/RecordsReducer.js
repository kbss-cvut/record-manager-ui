import * as ActionConstants from "../constants/ActionConstants";
import { ACTION_STATUS } from "../constants/DefaultConstants";

const initialState = {
  recordsLoaded: {},
  recordsPhases: {},
  isAllowedRejectMessage: {},
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
          records: action.records,
          pageCount: action.pageCount,
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
    case ActionConstants.LOAD_ALLOWED_REJECT_MESSAGE_PENDING:
      return {
        ...state,
        isAllowedRejectMessage: {
          status: ACTION_STATUS.PENDING,
          ...state.isAllowedRejectMessage,
        },
      };

    case ActionConstants.LOAD_ALLOWED_REJECT_MESSAGE_SUCCESS:
      return {
        ...state,
        isAllowedRejectMessage: {
          status: ACTION_STATUS.PENDING,
          data: state.isAllowedRejectMessage,
          error: "",
        },
      };
    case ActionConstants.LOAD_ALLOWED_REJECT_MESSAGE_ERROR:
      return {
        ...state,
        isAllowedRejectMessage: {
          status: ACTION_STATUS.ERROR,
          error: action.error,
        },
      };

    default:
      return state;
  }
}
