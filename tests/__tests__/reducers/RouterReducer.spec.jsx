import * as ActionConstants from "../../../src/constants/ActionConstants";
import RouterReducer from "../../../src/reducers/RouterReducer";
import { describe, expect, it, vi } from "vitest";

describe("RouterReducer", function () {
  const routeName = "user",
    payload = { data: 123456 },
    handlers = { onEvent: vi.fn() };

  it("leaves state unchanged if action not recognized", () => {
    const initialState = {
      transitionPayload: {},
      viewHandlers: {},
      testEntry: "should not touch",
    };

    expect(
      RouterReducer(initialState, {
        type: "NONEXISTENT_ACTION_TYPE",
        payload: "error",
      }),
    ).toEqual({
      transitionPayload: {},
      viewHandlers: {},
      testEntry: initialState.testEntry,
    });
  });

  it("handles action SET_TRANSITION_PAYLOAD", () => {
    const initialState = {
      transitionPayload: {},
      viewHandlers: {},
      testEntry: "should not touch",
    };

    expect(
      RouterReducer(initialState, {
        type: ActionConstants.SET_TRANSITION_PAYLOAD,
        routeName,
        payload,
      }),
    ).toEqual({
      transitionPayload: {
        [routeName]: payload,
      },
      viewHandlers: {},
      testEntry: initialState.testEntry,
    });
  });

  it("handles action SET_VIEW_HANDLERS", () => {
    const initialState = {
      transitionPayload: {},
      viewHandlers: {},
      testEntry: "should not touch",
    };

    expect(
      RouterReducer(initialState, {
        type: ActionConstants.SET_VIEW_HANDLERS,
        routeName,
        handlers,
      }),
    ).toEqual({
      transitionPayload: {},
      viewHandlers: {
        [routeName]: handlers,
      },
      testEntry: initialState.testEntry,
    });
  });
});
