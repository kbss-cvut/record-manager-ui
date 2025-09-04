import * as ActionConstants from "../../../src/constants/ActionConstants";
import { ACTION_STATUS } from "../../../src/constants/DefaultConstants";
import AuthReducer from "../../../src/reducers/AuthReducer";
import { describe, expect, it } from "vitest";
import { getRoles } from "../../../src/utils/RoleUtils.js";

describe("AuthReducer", function () {
  const user = {
      username: "test",
    },
    error = {
      message: "An error has occurred.",
    };

  it("handles AUTH_USER_PENDING", () => {
    const initialState = {
      authenticated: false,
      isLoaded: false,
      isLogging: false,
      testEntry: "should not touch",
    };
    const action = {
      type: ActionConstants.AUTH_USER_PENDING,
    };

    const newState = AuthReducer(initialState, action);

    const expectedState = {
      authenticated: false,
      isLoaded: false,
      isLogging: true,
      testEntry: initialState.testEntry,
    };
    expect(newState).toEqual(expectedState);
  });

  it("handles AUTH_USER_SUCCESS", () => {
    const initialState = {
      authenticated: false,
      isLoaded: false,
      isLogging: true,
      testEntry: "should not touch",
    };
    const action = {
      type: ActionConstants.AUTH_USER_SUCCESS,
    };

    const newState = AuthReducer(initialState, action);

    const expectedState = {
      error: "",
      authenticated: true,
      isLoaded: false,
      isLogging: false,
      testEntry: initialState.testEntry,
    };
    expect(newState).toEqual(expectedState);
  });

  it("handles AUTH_USER_ERROR", () => {
    const initialState = {
      authenticated: false,
      isLoaded: false,
      isLogging: true,
      testEntry: "should not touch",
    };
    const action = {
      type: ActionConstants.AUTH_USER_ERROR,
      error,
    };

    const newState = AuthReducer(initialState, action);

    const expectedState = {
      testEntry: "should not touch",
      authenticated: false,
      isLoaded: false,
      isLogging: false,
      error,
    };
    expect(newState).toEqual(expectedState);
  });

  it("handles LOAD_USER_PROFILE_PENDING", () => {
    const initialState = {
      authenticated: false,
      isLoaded: false,
      testEntry: "should not touch",
    };
    const action = {
      type: ActionConstants.LOAD_USER_PROFILE_PENDING,
    };

    const newState = AuthReducer(initialState, action);

    const expectedState = {
      isLoaded: false,
      authenticated: false,
      status: ACTION_STATUS.PENDING,
      testEntry: initialState.testEntry,
    };
    expect(newState).toEqual(expectedState);
  });

  it("handles LOAD_USER_PROFILE_SUCCESS", () => {
    const initialState = {
      authenticated: false,
      isLoaded: false,
      testEntry: "should not touch",
    };
    const action = {
      type: ActionConstants.LOAD_USER_PROFILE_SUCCESS,
      user,
    };

    const newState = AuthReducer(initialState, action);

    const expectedState = {
      isLoaded: true,
      authenticated: true,
      status: ACTION_STATUS.SUCCESS,
      user: {
        ...user,
        roles: getRoles(user),
      },
      testEntry: initialState.testEntry,
    };
    expect(newState).toEqual(expectedState);
  });

  it("handles LOAD_USER_PROFILE_ERROR", () => {
    const initialState = {
      authenticated: false,
      isLoaded: false,
      testEntry: "should not touch",
    };
    const action = {
      type: ActionConstants.LOAD_USER_PROFILE_ERROR,
      error,
    };

    const newState = AuthReducer(initialState, action);

    const expectedState = {
      isLoaded: false,
      authenticated: false,
      status: ACTION_STATUS.ERROR,
      user: {
        error: error,
      },
      testEntry: initialState.testEntry,
    };
    expect(newState).toEqual(expectedState);
  });

  it("handles PASSWORD_RESET_PENDING action", () => {
    const initialState = {
      testEntry: "should not touch",
    };

    expect(
      AuthReducer(initialState, {
        type: ActionConstants.PASSWORD_RESET_PENDING,
      }),
    ).toEqual({
      passwordResetStatus: ACTION_STATUS.PENDING,
      testEntry: initialState.testEntry,
    });
  });

  it("handles PASSWORD_RESET_SUCCESS action", () => {
    const initialState = {
      testEntry: "should not touch",
    };

    expect(
      AuthReducer(initialState, {
        type: ActionConstants.PASSWORD_RESET_SUCCESS,
      }),
    ).toEqual({
      passwordResetStatus: ACTION_STATUS.SUCCESS,
      testEntry: initialState.testEntry,
    });
  });

  it("handles VALIDATE_TOKEN_PENDING action", () => {
    const initialState = {
      testEntry: "should not touch",
    };

    expect(
      AuthReducer(initialState, {
        type: ActionConstants.VALIDATE_TOKEN_PENDING,
      }),
    ).toEqual({
      validTokenStatus: ACTION_STATUS.PENDING,
      testEntry: initialState.testEntry,
    });
  });

  it("handles VALIDATE_TOKEN_SUCCESS action", () => {
    const initialState = {
      testEntry: "should not touch",
    };

    expect(
      AuthReducer(initialState, {
        type: ActionConstants.VALIDATE_TOKEN_SUCCESS,
      }),
    ).toEqual({
      validTokenStatus: ACTION_STATUS.SUCCESS,
      testEntry: initialState.testEntry,
    });
  });

  it("handles VALIDATE_TOKEN_ERROR action", () => {
    const initialState = {
      testEntry: "should not touch",
    };

    expect(
      AuthReducer(initialState, {
        type: ActionConstants.VALIDATE_TOKEN_ERROR,
        error,
      }),
    ).toEqual({
      validTokenStatus: ACTION_STATUS.ERROR,
      testEntry: initialState.testEntry,
    });
  });

  it("handles PASSWORD_CHANGE_TOKEN_PENDING action", () => {
    const initialState = {
      passwordChange: {},
      testEntry: "should not touch",
    };

    expect(
      AuthReducer(initialState, {
        type: ActionConstants.PASSWORD_CHANGE_TOKEN_PENDING,
      }),
    ).toEqual({
      passwordChange: {
        status: ACTION_STATUS.PENDING,
      },
      testEntry: initialState.testEntry,
    });
  });

  it("handles PASSWORD_CHANGE_TOKEN_SUCCESS action", () => {
    const initialState = {
      passwordChange: {},
      testEntry: "should not touch",
    };

    expect(
      AuthReducer(initialState, {
        type: ActionConstants.PASSWORD_CHANGE_TOKEN_SUCCESS,
      }),
    ).toEqual({
      passwordChange: {
        status: ACTION_STATUS.SUCCESS,
      },
      testEntry: initialState.testEntry,
    });
  });

  it("handles PASSWORD_CHANGE_TOKEN_ERROR action", () => {
    const initialState = {
      passwordChange: {},
      testEntry: "should not touch",
    };

    expect(
      AuthReducer(initialState, {
        type: ActionConstants.PASSWORD_CHANGE_TOKEN_ERROR,
        error,
      }),
    ).toEqual({
      passwordChange: {
        status: ACTION_STATUS.ERROR,
        error,
      },
      testEntry: initialState.testEntry,
    });
  });
});
