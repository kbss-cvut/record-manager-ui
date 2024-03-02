"use strict";

import React from "react";
import * as ActionConstants from "../../../js/constants/ActionConstants";
import UsersReducer from "../../../js/reducers/UsersReducer";
import { ACTION_STATUS } from "../../../js/constants/DefaultConstants";

describe("UsersReducer", function () {
  const users = [{ username: "test1" }, { username: "test2" }],
    error = {
      message: "An error has occurred.",
    };

  it("handles LOAD_USERS_PENDING", () => {
    const initialState = {
      usersLoaded: {
        testEntry: "should not touch",
      },
      testEntry2: "should not touch",
    };
    const action = {
      type: ActionConstants.LOAD_USERS_PENDING,
    };

    const newState = UsersReducer(initialState, action);

    const expectedState = {
      usersLoaded: {
        testEntry: initialState.usersLoaded.testEntry,
        status: ACTION_STATUS.PENDING,
      },
      testEntry2: initialState.testEntry2,
    };
    expect(newState).toEqual(expectedState);
  });

  it("handles LOAD_USERS_SUCCESS", () => {
    const initialState = {
      usersLoaded: {
        status: ACTION_STATUS.PENDING,
      },
      testEntry: "should not touch",
    };
    const action = {
      type: ActionConstants.LOAD_USERS_SUCCESS,
      users,
    };

    const newState = UsersReducer(initialState, action);

    const expectedState = {
      usersLoaded: {
        status: ACTION_STATUS.SUCCESS,
        users,
        error: "",
      },
      testEntry: initialState.testEntry,
    };
    expect(newState).toEqual(expectedState);
  });

  it("handles LOAD_USERS_ERROR", () => {
    const initialState = {
      usersLoaded: {
        status: ACTION_STATUS.PENDING,
      },
      testEntry: "should not touch",
    };
    const action = {
      type: ActionConstants.LOAD_USERS_ERROR,
      error,
    };

    const newState = UsersReducer(initialState, action);

    const expectedState = {
      usersLoaded: {
        status: ACTION_STATUS.ERROR,
        error,
      },
      testEntry: initialState.testEntry,
    };
    expect(newState).toEqual(expectedState);
  });
});
