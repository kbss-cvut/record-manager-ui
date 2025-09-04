import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import * as ActionConstants from "../../../src/constants/ActionConstants";
import MockAdapter from "axios-mock-adapter";
import { TEST_TIMEOUT } from "../../constants/DefaultTestConstants";
import { axiosBackend } from "../../../src/actions";

import {
  loadRecords,
  loadRecordsByInstitution,
  loadRecordsError,
  loadRecordsPending,
  loadRecordsSuccess,
} from "../../../src/actions/RecordsActions";
import { API_URL } from "../../../config";
import { mockDateNow, restoreDateNow } from "../../environment/Environment";
import { errorMessage } from "../../../src/model/Message";
import en from "../../../src/i18n/en";
import { it, describe, expect, beforeEach, afterEach } from "vitest";
import { admin, entryClerk } from "../../__mocks__/users.js";

const records = [{ key: 786785600 }, { key: 86875960 }];

describe("Records synchronous actions", function () {
  it("creates an action to fetch all records", () => {
    const expectedAction = {
      type: ActionConstants.LOAD_RECORDS_PENDING,
    };
    expect(loadRecordsPending()).toEqual(expectedAction);
  });

  it("creates an action to save fetched records", () => {
    const expectedAction = {
      type: ActionConstants.LOAD_RECORDS_SUCCESS,
      records,
    };
    expect(loadRecordsSuccess(records)).toEqual(expectedAction);
  });

  it("creates an action about error during fetching records", () => {
    const error = { message: "error" };
    const expectedAction = {
      type: ActionConstants.LOAD_RECORDS_ERROR,
      error,
    };
    expect(loadRecordsError(error)).toEqual(expectedAction);
  });
});

const middlewares = [thunk.withExtraArgument(axiosBackend)];
const mockStore = configureMockStore(middlewares);

describe("Records asynchronous actions", function () {
  let store, mockApi;
  const error = {
      message: "An error has occurred.",
      requestUri: "/rest/records/xxx",
    },
    institutionKey = 12345678;

  beforeEach(() => {
    mockApi = new MockAdapter(axiosBackend);
    store = mockStore({ intl: en, auth: { user: admin } });
    mockDateNow();
  });

  afterEach(() => {
    restoreDateNow();
  });

  it("creates LOAD_RECORDS_SUCCESS action when loading all records successfully is done", () =>
    new Promise((done) => {
      const expectedActions = [
        { type: ActionConstants.LOAD_RECORDS_PENDING },
        { type: ActionConstants.LOAD_RECORDS_SUCCESS, records },
      ];

      mockApi.onGet(`${API_URL}/rest/records`).reply(200, records, {});

      store.dispatch(loadRecords());

      setTimeout(() => {
        expect(store.getActions()).toEqual(expectedActions);
        done();
      }, TEST_TIMEOUT);
    }));

  it("creates LOAD_RECORDS_SUCCESS action when loading entryClerk's institution records is done successfully", () =>
    new Promise((done) => {
      const expectedActions = [
        { type: ActionConstants.LOAD_RECORDS_PENDING },
        { type: ActionConstants.LOAD_RECORDS_SUCCESS, records },
      ];
      store.getState().auth.user = entryClerk;

      mockApi.onGet(`${API_URL}/rest/records`).reply(200, records, {});

      store.dispatch(loadRecords());

      setTimeout(() => {
        expect(store.getActions()).toEqual(expectedActions);
        done();
      }, TEST_TIMEOUT);
    }));

  it("creates LOAD_RECORDS_SUCCESS action when loading institution records by institution key is done successfully", () =>
    new Promise((done) => {
      const expectedActions = [
        { type: ActionConstants.LOAD_RECORDS_PENDING },
        { type: ActionConstants.LOAD_RECORDS_SUCCESS, records },
      ];

      mockApi.onGet(`${API_URL}/rest/records`).reply(200, records, {});

      store.dispatch(loadRecordsByInstitution(institutionKey));

      setTimeout(() => {
        expect(store.getActions()).toEqual(expectedActions);
        done();
      }, TEST_TIMEOUT);
    }));

  it("creates LOAD_RECORDS_ERROR action if an error occurred during loading records", () =>
    new Promise((done) => {
      const expectedActions = [
        { type: ActionConstants.LOAD_RECORDS_PENDING },
        { type: ActionConstants.LOAD_RECORDS_ERROR, error },
        {
          type: ActionConstants.PUBLISH_MESSAGE,
          message: errorMessage("records.loading-error", { error: error.message }),
        },
      ];

      mockApi.onGet(`${API_URL}/rest/records`).reply(400, error);

      store.dispatch(loadRecords());

      setTimeout(() => {
        expect(store.getActions()).toEqual(expectedActions);
        done();
      }, TEST_TIMEOUT);
    }));
});
