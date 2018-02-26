import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from "../../js/actions";
import * as ActionConstants from "../../js/constants/ActionConstants";
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {ACTION_FLAG} from "../../js/constants/DefaultConstants";

const TEST_TIMEOUT = 300;
const middlewares = [thunk.withExtraArgument(axios)];
const mockStore = configureMockStore(middlewares);

describe('Testing User asynchronize actions', function () {
    let store,
        MockApi;
    const user = {username: 'test'},
        users = [{username: 'test1'}, {username: 'test2'}],
        error = {
            "message" : "An error has occurred.",
            "requestUri": "/rest/users/xxx"
        },
        username = 'test';

    beforeEach(() => {
        MockApi = new MockAdapter(axios);
        store = mockStore();
    });

    it('creates SAVE_USER_SUCCESS action when saving user successfully is done', function (done) {
        const expectedActions = [
            { type: ActionConstants.SAVE_USER_PENDING, actionFlag: ACTION_FLAG.CREATE_USER },
            { type: ActionConstants.SAVE_USER_SUCCESS, actionFlag: ACTION_FLAG.CREATE_USER, user},
            { type: ActionConstants.LOAD_USERS_PENDING},
            { type: ActionConstants.LOAD_USERS_SUCCESS, users},
        ];

        MockApi.onPost('rest/users').reply(200);
        MockApi.onGet('rest/users').reply(200, users);

        store.dispatch(actions.createUser(user));

        setTimeout(() => {
            expect(store.getActions()).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });

    it('creates SAVE_USER_ERROR action if an error occurred during creating user', function (done) {
        const expectedActions = [
            { type: ActionConstants.SAVE_USER_PENDING, actionFlag: ACTION_FLAG.CREATE_USER },
            { type: ActionConstants.SAVE_USER_ERROR, actionFlag: ACTION_FLAG.CREATE_USER, error, user}
        ];

        MockApi.onPost('rest/users').reply(400, error);

        store.dispatch(actions.createUser(user));

        setTimeout(() => {
            expect(store.getActions()).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });

    it('creates UPDATE_USER_COMPLETE action when saving user successfully is done', function (done) {
        const expectedActions = [
            { type: ActionConstants.SAVE_USER_PENDING, actionFlag: ACTION_FLAG.UPDATE_USER },
            { type: ActionConstants.SAVE_USER_SUCCESS, actionFlag: ACTION_FLAG.UPDATE_USER, user},
            { type: ActionConstants.LOAD_USERS_PENDING},
            { type: ActionConstants.LOAD_USERS_SUCCESS, users},
        ];

        MockApi.onPut(`rest/users/${user.username}`).reply(200);
        MockApi.onGet('rest/users').reply(200, users);

        store.dispatch(actions.updateUser(user));

        setTimeout(() => {
            expect(store.getActions()).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });

    it('creates SAVE_USER_ERROR action if an error occurred during updating user', function (done) {
        const expectedActions = [
            { type: ActionConstants.SAVE_USER_PENDING, actionFlag: ACTION_FLAG.UPDATE_USER },
            { type: ActionConstants.SAVE_USER_ERROR, actionFlag: ACTION_FLAG.UPDATE_USER, error, user}
        ];

        MockApi.onPut(`rest/users/${user.username}`).reply(400, error);

        store.dispatch(actions.updateUser(user));

        setTimeout(() => {
            expect(store.getActions()).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });


    it('creates DELETE_USER_SUCCESS action when deleting user successfully is done', function (done) {
        const expectedActions = [
            { type: ActionConstants.DELETE_USER_PENDING, username},
            { type: ActionConstants.LOAD_USERS_PENDING},
            { type: ActionConstants.DELETE_USER_SUCCESS, user},
            { type: ActionConstants.LOAD_USERS_SUCCESS, users},
        ];

        MockApi.onDelete(`rest/users/${user.username}`).reply(200);
        MockApi.onGet('rest/users').reply(200, users);

        store.dispatch(actions.deleteUser(user));

        setTimeout(() => {
            expect(store.getActions()).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });

    it('creates SAVE_USER_ERROR action if an error occurred during updating user', function (done) {
        const expectedActions = [
            { type: ActionConstants.DELETE_USER_PENDING, username},
            { type: ActionConstants.DELETE_USER_ERROR, error, user}
        ];

        MockApi.onDelete(`rest/users/${user.username}`).reply(400, error);

        store.dispatch(actions.deleteUser(user));

        setTimeout(() => {
            expect(store.getActions()).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });

    it('creates LOAD_USER_SUCCESS action when loading user successfully is done', function (done) {
        const expectedActions = [
            { type: ActionConstants.LOAD_USER_PENDING},
            { type: ActionConstants.LOAD_USER_SUCCESS, user}
        ];

        MockApi.onGet(`rest/users/${user.username}`).reply(200, {username});

        store.dispatch(actions.loadUser(user.username));

        setTimeout(() => {
            expect(store.getActions()).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });

    it('creates LOAD_USER_ERROR action if an error occurred during loading user', function (done) {
        const expectedActions = [
            { type: ActionConstants.LOAD_USER_PENDING},
            { type: ActionConstants.LOAD_USER_ERROR, error}
        ];

        MockApi.onGet(`rest/users/${user.username}`).reply(400, error);

        store.dispatch(actions.loadUser(user.username));

        setTimeout(() => {
            expect(store.getActions()).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
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