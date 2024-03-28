import { ACTION_STATUS } from "../../../src/constants/DefaultConstants";
import * as ActionConstants from "../../../src/constants/ActionConstants";
import InstitutionsReducer from "../../../src/reducers/InstitutionsReducer";
import { describe, expect, it } from "vitest";

describe("InstitutionsReducer", function () {
  const institutions = [{ key: "test1" }, { key: "test2" }],
    error = {
      message: "An error has occurred.",
    };

  it("handles LOAD_INSTITUTIONS_PENDING", () => {
    const initialState = {
      institutionsLoaded: {
        testEntry1: "should not touch",
      },
      testEntry2: "should not touch",
    };

    expect(
      InstitutionsReducer(initialState, {
        type: ActionConstants.LOAD_INSTITUTIONS_PENDING,
      }),
    ).toEqual({
      institutionsLoaded: {
        status: ACTION_STATUS.PENDING,
        testEntry1: "should not touch",
      },
      testEntry2: "should not touch",
    });
  });

  it("handles LOAD_INSTITUTIONS_SUCCESS", () => {
    const initialState = {
      institutionsLoaded: {
        status: ACTION_STATUS.PENDING,
      },
      testEntry: "should not touch",
    };

    expect(
      InstitutionsReducer(initialState, {
        type: ActionConstants.LOAD_INSTITUTIONS_SUCCESS,
        institutions,
      }),
    ).toEqual({
      institutionsLoaded: {
        status: ACTION_STATUS.SUCCESS,
        institutions,
        error: "",
      },
      testEntry: initialState.testEntry,
    });
  });

  it("handles LOAD_INSTITUTIONS_ERROR", () => {
    const initialState = {
      institutionsLoaded: {
        status: ACTION_STATUS.PENDING,
      },
      testEntry: "should not touch",
    };

    expect(
      InstitutionsReducer(initialState, {
        type: ActionConstants.LOAD_INSTITUTIONS_ERROR,
        error,
      }),
    ).toEqual({
      institutionsLoaded: {
        status: ACTION_STATUS.ERROR,
        error,
      },
      testEntry: initialState.testEntry,
    });
  });
});
