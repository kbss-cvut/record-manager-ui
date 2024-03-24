import HistoryReducer from "../../../src/reducers/HistoryReducer";
import * as ActionConstants from "../../../src/constants/ActionConstants";
import { ACTION_STATUS } from "../../../src/constants/DefaultConstants";
import { describe, expect, it } from "vitest";

describe("HistoryReducer", function () {
  const error = {
      message: "An error has occurred.",
    },
    action = { type: "TEST_ACTION" },
    actions = [action, action];

  it("leaves state unchanged if action not recognized", () => {
    const initialState = {
      testEntry: "should not touch",
    };

    expect(
      HistoryReducer(initialState, {
        type: "NONEXISTENT_ACTION_TYPE",
        payload: "error",
      }),
    ).toEqual({
      testEntry: initialState.testEntry,
    });
  });

  it("handles LOAD_ACTIONS_HISTORY_PENDING", () => {
    const initialState = {
      testEntry: "should not touch",
    };

    expect(
      HistoryReducer(initialState, {
        type: ActionConstants.LOAD_ACTIONS_HISTORY_PENDING,
      }),
    ).toEqual({
      actionsLoaded: {
        status: ACTION_STATUS.PENDING,
      },
      testEntry: initialState.testEntry,
    });
  });

  it("handles LOAD_ACTIONS_HISTORY_SUCCESS", () => {
    const initialState = {
      actionsLoaded: {},
      testEntry: "should not touch",
    };

    expect(
      HistoryReducer(initialState, {
        type: ActionConstants.LOAD_ACTIONS_HISTORY_SUCCESS,
        actionsHistory: actions,
      }),
    ).toEqual({
      actionsLoaded: {
        status: ACTION_STATUS.SUCCESS,
        actions,
        error: "",
      },
      testEntry: initialState.testEntry,
    });
  });

  it("handles LOAD_ACTIONS_HISTORY_ERROR", () => {
    const initialState = {
      actionsLoaded: {},
      testEntry: "should not touch",
    };

    expect(
      HistoryReducer(initialState, {
        type: ActionConstants.LOAD_ACTIONS_HISTORY_ERROR,
        error,
      }),
    ).toEqual({
      actionsLoaded: {
        status: ACTION_STATUS.ERROR,
        error,
      },
      testEntry: initialState.testEntry,
    });
  });

  it("handles LOAD_ACTION_HISTORY_PENDING", () => {
    const initialState = {
      testEntry: "should not touch",
    };

    expect(
      HistoryReducer(initialState, {
        type: ActionConstants.LOAD_ACTION_HISTORY_PENDING,
      }),
    ).toEqual({
      actionLoaded: {
        status: ACTION_STATUS.PENDING,
      },
      testEntry: initialState.testEntry,
    });
  });

  it("handles LOAD_ACTION_HISTORY_SUCCESS", () => {
    const initialState = {
      actionLoaded: {},
      testEntry: "should not touch",
    };

    expect(
      HistoryReducer(initialState, {
        type: ActionConstants.LOAD_ACTION_HISTORY_SUCCESS,
        actionHistory: action,
      }),
    ).toEqual({
      actionLoaded: {
        status: ACTION_STATUS.SUCCESS,
        action: action,
        error: "",
      },
      testEntry: initialState.testEntry,
    });
  });

  it("handles LOAD_ACTION_HISTORY_ERROR", () => {
    const initialState = {
      actionLoaded: {},
      testEntry: "should not touch",
    };

    expect(
      HistoryReducer(initialState, {
        type: ActionConstants.LOAD_ACTION_HISTORY_ERROR,
        error,
      }),
    ).toEqual({
      actionLoaded: {
        status: ACTION_STATUS.ERROR,
        error,
      },
      testEntry: initialState.testEntry,
    });
  });

  it("handles UNLOAD_ACTION_HISTORY", () => {
    const initialState = {
      actionLoaded: {
        status: ACTION_STATUS.ERROR,
        error,
      },
      testEntry: "should not touch",
    };

    expect(
      HistoryReducer(initialState, {
        type: ActionConstants.UNLOAD_ACTION_HISTORY,
      }),
    ).toEqual({
      actionLoaded: {},
      testEntry: initialState.testEntry,
    });
  });
});
