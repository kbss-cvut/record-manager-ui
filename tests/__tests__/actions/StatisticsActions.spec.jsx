import * as ActionConstants from "../../../src/constants/ActionConstants";
import { TEST_TIMEOUT } from "../../constants/DefaultTestConstants";
import { axiosBackend } from "../../../src/actions";
import MockAdapter from "axios-mock-adapter";
import thunk from "redux-thunk";
import configureMockStore from "redux-mock-store";
import { loadStatistics } from "../../../src/actions/StatisticsActions";
import { API_URL } from "../../../config";
import { errorMessage } from "../../../src/model/Message";
import { mockDateNow, restoreDateNow } from "../../environment/Environment";
import { it, describe, expect, beforeEach, afterEach } from "vitest";

const middlewares = [thunk.withExtraArgument(axiosBackend)];
const mockStore = configureMockStore(middlewares);

describe("Statistics asynchronous actions", function () {
  let store, mockApi;
  const payload = { numberOfRecords: 5, numberOfInstitutions: 10 },
    error = {
      message: "An error has occurred.",
    };

  beforeEach(() => {
    mockApi = new MockAdapter(axiosBackend);
    store = mockStore();
    mockDateNow();
  });

  afterEach(() => {
    restoreDateNow();
  });

  it("creates LOAD_STATISTICS_SUCCESS action when loading statistics is successfully done", () =>
    new Promise((done) => {
      const expectedActions = [
        { type: ActionConstants.LOAD_STATISTICS_PENDING },
        { type: ActionConstants.LOAD_STATISTICS_SUCCESS, payload },
      ];

      mockApi.onGet(`${API_URL}/rest/statistics`).reply(200, payload);

      store.dispatch(loadStatistics());

      setTimeout(() => {
        expect(store.getActions()).toEqual(expectedActions);
        done();
      }, TEST_TIMEOUT);
    }));

  it("creates LOAD_STATISTICS_ERROR action if an error occurred during loading statistics", () =>
    new Promise((done) => {
      const expectedActions = [
        { type: ActionConstants.LOAD_STATISTICS_PENDING },
        { type: ActionConstants.LOAD_STATISTICS_ERROR, error },
        {
          type: ActionConstants.PUBLISH_MESSAGE,
          message: errorMessage("history.loading-error", { error: error.message }),
        },
      ];

      mockApi.onGet(`${API_URL}/rest/statistics`).reply(400, error);

      store.dispatch(loadStatistics());

      setTimeout(() => {
        expect(store.getActions()).toEqual(expectedActions);
        done();
      }, TEST_TIMEOUT);
    }));
});
