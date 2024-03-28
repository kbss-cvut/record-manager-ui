import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import * as ActionConstants from "../../../src/constants/ActionConstants";
import MockAdapter from "axios-mock-adapter";
import { TEST_TIMEOUT } from "../../constants/DefaultTestConstants";
import { axiosBackend } from "../../../src/actions";
import * as actions from "../../../src/actions/AuthActions";
import { API_URL } from "../../../config";
import { it, describe, expect, beforeEach } from "vitest";

describe("Auth synchronize actions", function () {
  const user = { username: "test" },
    error = { message: "error" };

  it("creates an action that user is authenticating", () => {
    const expectedAction = {
      type: ActionConstants.AUTH_USER_PENDING,
    };
    expect(actions.userAuthPending()).toEqual(expectedAction);
  });

  it("creates an action that user was authenticated", () => {
    const expectedAction = {
      type: ActionConstants.AUTH_USER_SUCCESS,
      username: user.username,
    };
    expect(actions.userAuthSuccess(user.username)).toEqual(expectedAction);
  });

  it("creates an action that there was error during authentication", () => {
    const expectedAction = {
      type: ActionConstants.AUTH_USER_ERROR,
      error,
    };
    expect(actions.userAuthError(error)).toEqual(expectedAction);
  });

  it("creates an action that user was unauthenticated", () => {
    const expectedAction = {
      type: ActionConstants.UNAUTH_USER,
    };
    expect(actions.unauthUser()).toEqual(expectedAction);
  });

  it("creates an action to fetch current user", () => {
    const expectedAction = {
      type: ActionConstants.LOAD_USER_PROFILE_PENDING,
    };
    expect(actions.loadUserProfilePending()).toEqual(expectedAction);
  });

  it("creates an action to save fetched current user", () => {
    const expectedAction = {
      type: ActionConstants.LOAD_USER_PROFILE_SUCCESS,
      user,
    };
    expect(actions.loadUserProfileSuccess(user)).toEqual(expectedAction);
  });

  it("creates an action about error during fetching current user", () => {
    const expectedAction = {
      type: ActionConstants.LOAD_USER_PROFILE_ERROR,
      error,
    };
    expect(actions.loadUserProfileError(error)).toEqual(expectedAction);
  });
});

const middlewares = [thunk.withExtraArgument(axiosBackend)];
const mockStore = configureMockStore(middlewares);

describe("Auth asynchronize actions", function () {
  let store, mockApi;
  const user = { username: "test", password: "testPassword", types: [] },
    error = {
      message: "An error has occurred.",
      requestUri: "/rest/users/xxx",
    };

  beforeEach(() => {
    mockApi = new MockAdapter(axiosBackend);
    store = mockStore();
  });

  it("creates AUTH_USER_SUCCESS action when logging in successfully is done", () =>
    new Promise((done) => {
      const reply = {
        errorMessage: null,
        loggedIn: true,
        success: true,
        username: "test",
      };
      const expectedActions = [
        { type: ActionConstants.AUTH_USER_PENDING },
        { type: ActionConstants.AUTH_USER_SUCCESS, username: user.username },
        { type: ActionConstants.LOAD_USER_PROFILE_PENDING },
        { type: ActionConstants.LOAD_USER_PROFILE_SUCCESS, user },
      ];

      mockApi.onPost(`${API_URL}/j_spring_security_check`).reply(200, reply);
      mockApi.onGet(`${API_URL}/rest/users/current`).reply(200, user);

      store.dispatch(actions.login(user.username, user.password, null));

      setTimeout(() => {
        expect(store.getActions()).toEqual(expectedActions);
        done();
      }, TEST_TIMEOUT);
    }));

  it("creates AUTH_USER_ERROR action when logging in fails", () =>
    new Promise((done) => {
      const reply = {
        errorMessage: "User with username test not found.",
        loggedIn: false,
        success: false,
        username: null,
      };
      const expectedActions = [
        { type: ActionConstants.AUTH_USER_PENDING },
        { type: ActionConstants.AUTH_USER_ERROR, error: reply },
      ];

      mockApi.onPost(`${API_URL}/j_spring_security_check`).reply(400, reply);

      store.dispatch(actions.login(user.username, user.password, null));

      setTimeout(() => {
        expect(store.getActions()).toEqual(expectedActions);
        done();
      }, TEST_TIMEOUT);
    }));

  it("creates UNAUTH_USER action when user successfully logs out", () =>
    new Promise((done) => {
      const expectedActions = [{ type: ActionConstants.UNAUTH_USER }];
      store.getState().auth = { user };

      mockApi.onPost(`${API_URL}/j_spring_security_logout`).reply(200);

      store.dispatch(actions.logout(user));

      setTimeout(() => {
        expect(store.getActions()).toEqual(expectedActions);
        done();
      }, TEST_TIMEOUT);
    }));

  it("creates LOAD_USER_PROFILE_SUCCESS action when current user is successfully loaded", () =>
    new Promise((done) => {
      const expectedActions = [
        { type: ActionConstants.LOAD_USER_PROFILE_PENDING },
        { type: ActionConstants.LOAD_USER_PROFILE_SUCCESS, user },
      ];

      mockApi.onGet(`${API_URL}/rest/users/current`).reply(200, user);

      store.dispatch(actions.loadUserProfile());

      setTimeout(() => {
        expect(store.getActions()).toEqual(expectedActions);
        done();
      }, TEST_TIMEOUT);
    }));

  it("creates LOAD_USER_PROFILE_ERROR action when current user is successfully loaded", () =>
    new Promise((done) => {
      const expectedActions = [
        { type: ActionConstants.LOAD_USER_PROFILE_PENDING },
        { type: ActionConstants.LOAD_USER_PROFILE_ERROR, error },
      ];

      mockApi.onGet(`${API_URL}/rest/users/current`).reply(400, error);

      store.dispatch(actions.loadUserProfile());

      setTimeout(() => {
        expect(store.getActions()).toEqual(expectedActions);
        done();
      }, TEST_TIMEOUT);
    }));

  it("creates PASSWORD_RESET_SUCCESS action when password is successfully reset", () =>
    new Promise((done) => {
      const email = "admin@gmail.com";
      const expectedActions = [
        { type: ActionConstants.PASSWORD_RESET_PENDING },
        { type: ActionConstants.PASSWORD_RESET_SUCCESS, email },
      ];

      mockApi.onPost(`${API_URL}/rest/users/password-reset`).reply(200);

      store.dispatch(actions.passwordReset(email));

      setTimeout(() => {
        expect(store.getActions()).toEqual(expectedActions);
        done();
      }, TEST_TIMEOUT);
    }));

  it("creates VALIDATE_TOKEN_SUCCESS action when token exists", () =>
    new Promise((done) => {
      const token = "12345";
      const expectedActions = [
        { type: ActionConstants.VALIDATE_TOKEN_PENDING },
        { type: ActionConstants.VALIDATE_TOKEN_SUCCESS },
      ];

      mockApi.onPost(`${API_URL}/rest/users/validate-token`).reply(200);

      store.dispatch(actions.validateToken(token));

      setTimeout(() => {
        expect(store.getActions()).toEqual(expectedActions);
        done();
      }, TEST_TIMEOUT);
    }));

  it("creates VALIDATE_TOKEN_ERROR action when token does not exist", () =>
    new Promise((done) => {
      const token = "12345";
      const expectedActions = [
        { type: ActionConstants.VALIDATE_TOKEN_PENDING },
        { type: ActionConstants.VALIDATE_TOKEN_ERROR },
      ];

      mockApi.onPost(`${API_URL}/rest/users/validate-token`).reply(400);

      store.dispatch(actions.validateToken(token));

      setTimeout(() => {
        expect(store.getActions()).toEqual(expectedActions);
        done();
      }, TEST_TIMEOUT);
    }));

  it("creates PASSWORD_CHANGE_TOKEN_SUCCESS action when token exists", () =>
    new Promise((done) => {
      const token = "12345";
      const password = "12345";
      const expectedActions = [
        { type: ActionConstants.PASSWORD_CHANGE_TOKEN_PENDING },
        { type: ActionConstants.PASSWORD_CHANGE_TOKEN_SUCCESS },
      ];

      mockApi.onPut(`${API_URL}/rest/users/password-change-token`).reply(200);

      store.dispatch(actions.changePasswordToken(password, token));

      setTimeout(() => {
        expect(store.getActions()).toEqual(expectedActions);
        done();
      }, TEST_TIMEOUT);
    }));

  it("creates PASSWORD_CHANGE_TOKEN_ERROR action when token does not exist", () =>
    new Promise((done) => {
      const token = "12345";
      const password = "12345";
      const expectedActions = [
        { type: ActionConstants.PASSWORD_CHANGE_TOKEN_PENDING },
        { type: ActionConstants.PASSWORD_CHANGE_TOKEN_ERROR },
      ];

      mockApi.onPut(`${API_URL}/rest/users/password-change-token`).reply(400);

      store.dispatch(actions.changePasswordToken(password, token));

      setTimeout(() => {
        expect(store.getActions()).toEqual(expectedActions);
        done();
      }, TEST_TIMEOUT);
    }));
});
