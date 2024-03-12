import StatisticsReducer from "../../../src/reducers/StatisticsReducer";
import * as ActionConstants from "../../../src/constants/ActionConstants";
import { ACTION_STATUS } from "../../../src/constants/DefaultConstants";

describe("StatisticsReducer", function () {
  const error = {
    message: "An error has occurred.",
  };

  it("leaves state unchanged if action not recognized", () => {
    const initialState = {
      testEntry: "should not touch",
    };

    expect(
      StatisticsReducer(initialState, {
        type: "NONEXISTENT_ACTION_TYPE",
        payload: "error",
      }),
    ).toEqual({
      testEntry: initialState.testEntry,
    });
  });

  it("handles LOAD_STATISTICS_PENDING", () => {
    const initialState = {
      testEntry: "should not touch",
    };

    expect(
      StatisticsReducer(initialState, {
        type: ActionConstants.LOAD_STATISTICS_PENDING,
      }),
    ).toEqual({
      status: ACTION_STATUS.PENDING,
      error: undefined,
      testEntry: initialState.testEntry,
    });
  });

  it("handles LOAD_STATISTICS_SUCCESS", () => {
    const initialState = {
      status: ACTION_STATUS.PENDING,
      testEntry: "should not touch",
    };

    expect(
      StatisticsReducer(initialState, {
        type: ActionConstants.LOAD_STATISTICS_SUCCESS,
        payload: {},
      }),
    ).toEqual({
      status: ACTION_STATUS.SUCCESS,
      error: undefined,
      data: {},
      testEntry: initialState.testEntry,
    });
  });

  it("handles LOAD_STATISTICS_ERROR", () => {
    const initialState = {
      status: ACTION_STATUS.PENDING,
      testEntry: "should not touch",
    };

    expect(
      StatisticsReducer(initialState, {
        type: ActionConstants.LOAD_STATISTICS_ERROR,
        error,
      }),
    ).toEqual({
      status: ACTION_STATUS.ERROR,
      error,
      testEntry: initialState.testEntry,
    });
  });
});
