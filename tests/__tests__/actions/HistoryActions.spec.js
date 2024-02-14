import * as ActionConstants from "../../../js/constants/ActionConstants";
import {TEST_TIMEOUT} from "../../constants/DefaultTestConstants";
import {axiosBackend} from "../../../js/actions";
import MockAdapter from 'axios-mock-adapter';
import thunk from "redux-thunk";
import configureMockStore from "redux-mock-store";
import {loadActionByKey, loadActions} from "../../../js/actions/HistoryActions";
import {API_URL} from '../../../config';
import {errorMessage} from "../../../js/model/Message";
import {mockDateNow, restoreDateNow} from "../../environment/Environment";
import {DEFAULT_PAGE_SIZE} from "../../../js/constants/DefaultConstants";

const middlewares = [thunk.withExtraArgument(axiosBackend)];
const mockStore = configureMockStore(middlewares);

describe('History asynchronize actions', function () {
    let store,
        mockApi;
    const error = {
            "message": "An error has occurred.",
        }, key = "12345",
        action = {type: 'TEST_ACTION'},
        actions = [action, action];

    beforeEach(() => {
        mockApi = new MockAdapter(axiosBackend);
        store = mockStore();
        mockDateNow();
    });

    afterEach(() => {
        restoreDateNow();
    });

    xit('creates LOAD_ACTION_HISTORY_SUCCESS action when loading of action is successfully done', function (done) {
        const expectedActions = [
            {type: ActionConstants.LOAD_ACTION_HISTORY_PENDING},
            {type: ActionConstants.LOAD_ACTION_HISTORY_SUCCESS, actionHistory: action}
        ];

        mockApi.onGet(`${API_URL}/rest/history/${key}`).reply(200, action);

        store.dispatch(loadActionByKey(key));

        setTimeout(() => {
            expect(store.getActions()).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });

    xit('creates LOAD_ACTION_HISTORY_ERROR action if an error occurred during loading of action', function (done) {
        const expectedActions = [
            {type: ActionConstants.LOAD_ACTION_HISTORY_PENDING},
            {type: ActionConstants.LOAD_ACTION_HISTORY_ERROR, error}
        ];

        mockApi.onGet(`${API_URL}/rest/history/${key}`).reply(400, error);

        store.dispatch(loadActionByKey(key));

        setTimeout(() => {
            expect(store.getActions()).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });

    xit('creates LOAD_ACTIONS_HISTORY_SUCCESS action when loading of actions is successfully done', function (done) {
        const expectedActions = [
            {type: ActionConstants.LOAD_ACTIONS_HISTORY_PENDING},
            {type: ActionConstants.LOAD_ACTIONS_HISTORY_SUCCESS, actionsHistory: actions}
        ];

        mockApi.onGet(`${API_URL}/rest/history?page=1`).reply(200, actions);

        store.dispatch(loadActions(1, null));

        setTimeout(() => {
            expect(store.getActions()).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });

    it('creates LOAD_ACTIONS_HISTORY_ERROR action if an error occurred during loading of actions', function (done) {
        const expectedActions = [
            {type: ActionConstants.LOAD_ACTIONS_HISTORY_PENDING},
            {type: ActionConstants.LOAD_ACTIONS_HISTORY_ERROR, error},
            {type: ActionConstants.PUBLISH_MESSAGE, message: errorMessage('history.loading-error', {error: error.message})}
        ];

        mockApi.onGet(`${API_URL}/rest/history?page=1&size=${DEFAULT_PAGE_SIZE}`).reply(400, error);

        store.dispatch(loadActions(1, null));

        setTimeout(() => {
            expect(store.getActions()).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });
});