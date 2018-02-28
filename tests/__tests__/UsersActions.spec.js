import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from "../../js/actions";
import * as ActionConstants from "../../js/constants/ActionConstants";
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('Users synchronize actions', function () {
    it('should create an action to fetch all users', () => {
        const expectedAction = {
            type: ActionConstants.LOAD_USERS_PENDING,
        };
        expect(actions.loadUsersPending()).toEqual(expectedAction)
    });

    it('should create an action to save fetched users', () => {
        const users = [{username: 'test1'},{username: 'test2'}];
        const expectedAction = {
            type: ActionConstants.LOAD_USERS_SUCCESS,
            users
        };
        expect(actions.loadUsersSuccess(users)).toEqual(expectedAction)
    });

    it('should create an action about error during fetching users', () => {
        const error = {message: 'error'};
        const expectedAction = {
            type: ActionConstants.LOAD_USERS_ERROR,
            error
        };
        expect(actions.loadUsersError(error)).toEqual(expectedAction)
    });
});

const TEST_TIMEOUT = 300;
const middlewares = [thunk.withExtraArgument(axios)];
const mockStore = configureMockStore(middlewares);

describe('Users asynchronize actions', function () {
    let store,
        MockApi;
    const users = [{username: 'test1'}, {username: 'test2'}],
        error = {
            "message" : "An error has occurred.",
            "requestUri": "/rest/users/xxx"
        };

    beforeEach(() => {
        MockApi = new MockAdapter(axios);
        store = mockStore();
    });

    it('creates LOAD_USERS_SUCCESS action when loading users successfully is done', function (done) {
        const expectedActions = [
            { type: ActionConstants.LOAD_USERS_PENDING},
            { type: ActionConstants.LOAD_USERS_SUCCESS, users}
        ];

        MockApi.onGet('rest/users').reply(200, users);

        store.dispatch(actions.loadUsers());

        setTimeout(() => {
            expect(store.getActions()).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });

    it('creates LOAD_USERS_ERROR action if an error occurred during loading users', function (done) {
        const expectedActions = [
            { type: ActionConstants.LOAD_USERS_PENDING},
            { type: ActionConstants.LOAD_USERS_ERROR, error}
        ];

        MockApi.onGet('rest/users').reply(400, error);

        store.dispatch(actions.loadUsers());

        setTimeout(() => {
            expect(store.getActions()).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });
});