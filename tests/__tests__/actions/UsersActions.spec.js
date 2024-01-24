import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as ActionConstants from "../../../js/constants/ActionConstants";
import MockAdapter from 'axios-mock-adapter';
import {TEST_TIMEOUT} from "../../constants/DefaultTestConstants";
import {axiosBackend} from "../../../js/actions";
import {loadUsers, loadUsersError, loadUsersPending, loadUsersSuccess} from "../../../js/actions/UsersActions";
import {API_URL} from '../../../config';
import {mockDateNow, restoreDateNow} from "../../environment/Environment";
import {errorMessage} from "../../../js/model/Message";

describe('Users synchronous actions', function () {
    it('creates an action to fetch all users', () => {
        const expectedAction = {
            type: ActionConstants.LOAD_USERS_PENDING,
        };
        expect(loadUsersPending()).toEqual(expectedAction)
    });

    it('creates an action to save fetched users', () => {
        const users = [{username: 'test1'},{username: 'test2'}];
        const expectedAction = {
            type: ActionConstants.LOAD_USERS_SUCCESS,
            users
        };
        expect(loadUsersSuccess(users)).toEqual(expectedAction)
    });

    it('creates an action about error during fetching users', () => {
        const error = {message: 'error'};
        const expectedAction = {
            type: ActionConstants.LOAD_USERS_ERROR,
            error
        };
        expect(loadUsersError(error)).toEqual(expectedAction)
    });
});

const middlewares = [thunk.withExtraArgument(axiosBackend)];
const mockStore = configureMockStore(middlewares);

describe('Users asynchronous actions', function () {
    let store,
        mockApi;
    const users = [{username: 'test1'}, {username: 'test2'}],
        error = {
            "message" : "An error has occurred.",
            "requestUri": "/rest/users/xxx"
        };

    beforeEach(() => {
        mockApi = new MockAdapter(axiosBackend);
        store = mockStore();
        mockDateNow();
    });

    afterEach(() => {
        restoreDateNow();
    });

    it('creates LOAD_USERS_SUCCESS action when loading users successfully is done', function (done) {
        const expectedActions = [
            { type: ActionConstants.LOAD_USERS_PENDING},
            { type: ActionConstants.LOAD_USERS_SUCCESS, users}
        ];

        mockApi.onGet(`${API_URL}/rest/users`).reply(200, users);

        store.dispatch(loadUsers());

        setTimeout(() => {
            expect(store.getActions()).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });

    it('creates LOAD_USERS_ERROR action if an error occurred during loading users', function (done) {
        const expectedActions = [
            { type: ActionConstants.LOAD_USERS_PENDING},
            { type: ActionConstants.LOAD_USERS_ERROR, error},
            { type: ActionConstants.PUBLISH_MESSAGE, message: errorMessage('users.loading-error', {error: error.message})}
        ];

        mockApi.onGet(`${API_URL}/rest/users`).reply(400, error);

        store.dispatch(loadUsers());

        setTimeout(() => {
            expect(store.getActions()).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });
});