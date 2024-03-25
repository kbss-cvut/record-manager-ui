import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import * as ActionConstants from "../../../src/constants/ActionConstants";
import MockAdapter from "axios-mock-adapter";
import { TEST_TIMEOUT } from "../../constants/DefaultTestConstants";
import { axiosBackend } from "../../../src/actions";
import { ACTION_FLAG, ROLE } from "../../../src/constants/DefaultConstants";
import {
  createRecord,
  deleteRecord,
  deleteRecordError,
  deleteRecordPending,
  deleteRecordSuccess,
  loadRecord,
  loadRecordError,
  loadRecordPending,
  loadRecordSuccess,
  saveRecordError,
  saveRecordPending,
  saveRecordSuccess,
  unloadRecord,
  unloadSavedRecord,
  updateRecord,
} from "../../../src/actions/RecordActions";
import { API_URL } from "../../../config";
import en from "../../../src/i18n/en";
import { mockDateNow, restoreDateNow } from "../../environment/Environment";
import { errorMessage, successMessage } from "../../../src/model/Message";

describe("Record synchronous actions", function () {
  const record = { key: 7979868757 },
    key = 7979868757,
    error = { message: "error" };

  it("creates an action to save record", () => {
    const actionFlag = ACTION_FLAG.CREATE_ENTITY;
    const expectedAction = {
      type: ActionConstants.SAVE_RECORD_PENDING,
      actionFlag,
    };
    expect(saveRecordPending(actionFlag)).toEqual(expectedAction);
  });

  it("creates an action to announce successful save of record", () => {
    const actionFlag = ACTION_FLAG.CREATE_ENTITY;
    const expectedAction = {
      type: ActionConstants.SAVE_RECORD_SUCCESS,
      record,
      key,
      actionFlag,
    };
    expect(saveRecordSuccess(record, key, actionFlag)).toEqual(expectedAction);
  });

  it("creates an action to announce unsuccessful save of record", () => {
    const actionFlag = ACTION_FLAG.UPDATE_ENTITY;
    const expectedAction = {
      type: ActionConstants.SAVE_RECORD_ERROR,
      error,
      record,
      actionFlag,
    };
    expect(saveRecordError(error, record, actionFlag)).toEqual(expectedAction);
  });

  it("creates an action to unload saved record", () => {
    const expectedAction = {
      type: ActionConstants.UNLOAD_SAVED_RECORD,
    };
    expect(unloadSavedRecord()).toEqual(expectedAction);
  });

  it("creates an action to delete record", () => {
    const expectedAction = {
      type: ActionConstants.DELETE_RECORD_PENDING,
      key,
    };
    expect(deleteRecordPending(key)).toEqual(expectedAction);
  });

  it("creates an action to announce successful delete of record", () => {
    const expectedAction = {
      type: ActionConstants.DELETE_RECORD_SUCCESS,
      record,
      key,
    };
    expect(deleteRecordSuccess(record, key)).toEqual(expectedAction);
  });

  it("creates an action to announce unsuccessful delete of record", () => {
    const expectedAction = {
      type: ActionConstants.DELETE_RECORD_ERROR,
      error,
      record,
      key,
    };
    expect(deleteRecordError(error, record, key)).toEqual(expectedAction);
  });

  it("creates an action to fetch record", () => {
    const expectedAction = {
      type: ActionConstants.LOAD_RECORD_PENDING,
    };
    expect(loadRecordPending()).toEqual(expectedAction);
  });

  it("creates an action to save fetched record", () => {
    const expectedAction = {
      type: ActionConstants.LOAD_RECORD_SUCCESS,
      record,
    };
    expect(loadRecordSuccess(record)).toEqual(expectedAction);
  });

  it("creates an action about error during fetching record", () => {
    const expectedAction = {
      type: ActionConstants.LOAD_RECORD_ERROR,
      error,
    };
    expect(loadRecordError(error)).toEqual(expectedAction);
  });

  it("creates an action to unload loaded record", () => {
    const expectedAction = {
      type: ActionConstants.UNLOAD_RECORD,
    };
    expect(unloadRecord()).toEqual(expectedAction);
  });
});

const middlewares = [thunk.withExtraArgument(axiosBackend)];
const mockStore = configureMockStore(middlewares);

describe("Record asynchronous actions", function () {
  let store, mockApi;
  const error = {
      message: "An error has occurred.",
      requestUri: "/rest/institutions/xxx",
    },
    record = { key: 696875909 },
    records = [{ key: 7986787608 }, { key: 8968756596 }],
    currentUser = {
      role: ROLE.ADMIN,
    },
    key = "696875909",
    location = `rest/records/${key}`;

  beforeEach(() => {
    mockApi = new MockAdapter(axiosBackend);
    store = mockStore({ intl: en, auth: { user: currentUser } });
    mockDateNow();
  });

  afterEach(() => {
    restoreDateNow();
  });

  it("creates SAVE_RECORD_SUCCESS action when saving record successfully is done", function (done) {
    const expectedActions = [
      { type: ActionConstants.SAVE_RECORD_PENDING, actionFlag: ACTION_FLAG.CREATE_ENTITY },
      { type: ActionConstants.SAVE_RECORD_SUCCESS, key, actionFlag: ACTION_FLAG.CREATE_ENTITY, record },
      { type: ActionConstants.LOAD_RECORDS_PENDING },
      { type: ActionConstants.PUBLISH_MESSAGE, message: successMessage("record.save-success") },
      { type: ActionConstants.LOAD_RECORDS_SUCCESS, records },
    ];

    mockApi.onPost(`${API_URL}/rest/records`).reply(200, null, { location });
    mockApi.onGet(`${API_URL}/rest/records`).reply(200, records, {});

    store.dispatch(createRecord(record));

    setTimeout(() => {
      expect(store.getActions()).toEqual(expectedActions);
      done();
    }, TEST_TIMEOUT);
  });

  it("creates UPDATE_RECORD_SUCCESS action when saving record successfully is done", function (done) {
    const expectedActions = [
      { type: ActionConstants.SAVE_RECORD_PENDING, actionFlag: ACTION_FLAG.UPDATE_ENTITY },
      { type: ActionConstants.SAVE_RECORD_SUCCESS, key: null, actionFlag: ACTION_FLAG.UPDATE_ENTITY, record },
      { type: ActionConstants.LOAD_RECORDS_PENDING },
      { type: ActionConstants.PUBLISH_MESSAGE, message: successMessage("record.save-success") },
      { type: ActionConstants.LOAD_RECORDS_SUCCESS, records },
    ];

    mockApi.onPut(`${API_URL}/rest/records/${record.key}`).reply(200, null, { location });
    mockApi.onGet(`${API_URL}/rest/records`).reply(200, records, {});

    store.dispatch(updateRecord(record));

    setTimeout(() => {
      expect(store.getActions()).toEqual(expectedActions);
      done();
    }, TEST_TIMEOUT);
  });

  it("creates SAVE_RECORD_ERROR action if an error occurred during updating record", function (done) {
    const expectedActions = [
      { type: ActionConstants.SAVE_RECORD_PENDING, actionFlag: ACTION_FLAG.UPDATE_ENTITY },
      { type: ActionConstants.SAVE_RECORD_ERROR, actionFlag: ACTION_FLAG.UPDATE_ENTITY, error, record },
      { type: ActionConstants.PUBLISH_MESSAGE, message: errorMessage("record.save-error", { error: undefined }) },
    ];

    mockApi.onPut(`${API_URL}/rest/records/${record.key}`).reply(400, error);

    store.dispatch(updateRecord(record));

    setTimeout(() => {
      expect(store.getActions()).toEqual(expectedActions);
      done();
    }, TEST_TIMEOUT);
  });

  it("creates DELETE_RECORD_SUCCESS action when deleting record successfully is done", function (done) {
    const expectedActions = [
      { type: ActionConstants.DELETE_RECORD_PENDING, key: record.key },
      { type: ActionConstants.LOAD_RECORDS_PENDING },
      { type: ActionConstants.DELETE_RECORD_SUCCESS, record, key: record.key },
      { type: ActionConstants.PUBLISH_MESSAGE, message: successMessage("record.delete-success") },
      { type: ActionConstants.LOAD_RECORDS_SUCCESS, records },
    ];

    mockApi.onDelete(`${API_URL}/rest/records/${record.key}`).reply(200);
    mockApi.onGet(`${API_URL}/rest/records`).reply(200, records, {});

    store.dispatch(deleteRecord(record));

    setTimeout(() => {
      expect(store.getActions()).toEqual(expectedActions);
      done();
    }, TEST_TIMEOUT);
  });

  it("creates DELETE_RECORD_ERROR action if an error occurred during deleting record", function (done) {
    const expectedActions = [
      { type: ActionConstants.DELETE_RECORD_PENDING, key: record.key },
      { type: ActionConstants.DELETE_RECORD_ERROR, error, record, key: record.key },
      { type: ActionConstants.PUBLISH_MESSAGE, message: errorMessage("record.delete-error", { error: error.message }) },
    ];

    mockApi.onDelete(`${API_URL}/rest/records/${record.key}`).reply(400, error);

    store.dispatch(deleteRecord(record));

    setTimeout(() => {
      expect(store.getActions()).toEqual(expectedActions);
      done();
    }, TEST_TIMEOUT);
  });

  it("creates LOAD_RECORD_SUCCESS action when loading record successfully is done", function (done) {
    const expectedActions = [
      { type: ActionConstants.LOAD_RECORD_PENDING },
      { type: ActionConstants.LOAD_RECORD_SUCCESS, record },
    ];

    mockApi.onGet(`${API_URL}/rest/records/${record.key}`).reply(200, { key: record.key });

    store.dispatch(loadRecord(record.key));

    setTimeout(() => {
      expect(store.getActions()).toEqual(expectedActions);
      done();
    }, TEST_TIMEOUT);
  });

  it("creates LOAD_RECORD_ERROR action if an error occurred during loading record", function (done) {
    const expectedActions = [
      { type: ActionConstants.LOAD_RECORD_PENDING },
      { type: ActionConstants.LOAD_RECORD_ERROR, error },
      { type: ActionConstants.PUBLISH_MESSAGE, message: errorMessage("record.load-error", { error: error.message }) },
    ];

    mockApi.onGet(`${API_URL}/rest/records/${record.key}`).reply(400, error);

    store.dispatch(loadRecord(record.key));

    setTimeout(() => {
      expect(store.getActions()).toEqual(expectedActions);
      done();
    }, TEST_TIMEOUT);
  });
});
