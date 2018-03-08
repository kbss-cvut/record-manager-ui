import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from "../../../js/actions/index";
import * as ActionConstants from "../../../js/constants/ActionConstants";
import MockAdapter from 'axios-mock-adapter';
import {ACTION_FLAG} from "../../../js/constants/DefaultConstants";
import {TEST_TIMEOUT} from "../../constants/DefaultTestConstants";
import {axiosBackend} from "../../../js/actions";

describe('User synchronize actions', function () {
    const user = {username: 'test'},
          error = {message: 'error'};

    it('should create an action to save user', () => {
        const actionFlag = ACTION_FLAG.CREATE_ENTITY;
        const expectedAction = {
            type: ActionConstants.SAVE_USER_PENDING,
            actionFlag
        };
        expect(actions.saveUserPending(actionFlag)).toEqual(expectedAction)
    });

    it('should create an action to announce successful save of user', () => {
        const actionFlag = ACTION_FLAG.CREATE_ENTITY ;
        const expectedAction = {
            type: ActionConstants.SAVE_USER_SUCCESS,
            user,
            actionFlag
        };
        expect(actions.saveUserSuccess(user, actionFlag)).toEqual(expectedAction)
    });

    it('should create an action to announce unsuccessful save of user', () => {
        const actionFlag = ACTION_FLAG.UPDATE_ENTITY ;
        const expectedAction = {
            type: ActionConstants.SAVE_USER_ERROR,
            error,
            user,
            actionFlag,
        };
        expect(actions.saveUserError(error, user, actionFlag)).toEqual(expectedAction)
    });

    it('should create an action to delete user', () => {
        const username = user.username;
        const expectedAction = {
            type: ActionConstants.DELETE_USER_PENDING,
            username
        };
        expect(actions.deleteUserPending(username)).toEqual(expectedAction)
    });

    it('should create an action to announce successful delete of user', () => {
        const expectedAction = {
            type: ActionConstants.DELETE_USER_SUCCESS,
            user
        };
        expect(actions.deleteUserSuccess(user)).toEqual(expectedAction)
    });

    it('should create an action to announce unsuccessful delete of user', () => {
        const expectedAction = {
            type: ActionConstants.DELETE_USER_ERROR,
            error,
            user
        };
        expect(actions.deleteUserError(error, user)).toEqual(expectedAction)
    });

    it('should create an action to fetch user', () => {
        const expectedAction = {
            type: ActionConstants.LOAD_USER_PENDING,
        };
        expect(actions.loadUserPending()).toEqual(expectedAction)
    });

    it('should create an action to save fetched user', () => {
        const expectedAction = {
            type: ActionConstants.LOAD_USER_SUCCESS,
            user
        };
        expect(actions.loadUserSuccess(user)).toEqual(expectedAction)
    });

    it('should create an action about error during fetching user', () => {
        const expectedAction = {
            type: ActionConstants.LOAD_USER_ERROR,
            error
        };
        expect(actions.loadUserError(error)).toEqual(expectedAction)
    });

    it('should create an action to unload loaded user', () => {
        const expectedAction = {
            type: ActionConstants.UNLOAD_USER,
        };
        expect(actions.unloadUser()).toEqual(expectedAction)
    });
});

const middlewares = [thunk.withExtraArgument(axiosBackend)];
const mockStore = configureMockStore(middlewares);

describe('User asynchronize actions', function () {
    let store,
        MockApi;
    const user = {username: 'test'},
        users = [
            {username: 'test1'},
            {username: 'test2'}
        ],
        error = {
            "message" : "An error has occurred.",
            "requestUri": "/rest/users/xxx"
        },
        username = 'test';

    beforeEach(() => {
        MockApi = new MockAdapter(axiosBackend);
        store = mockStore();
    });

    it('creates SAVE_USER_SUCCESS action when saving user successfully is done', function (done) {
        const expectedActions = [
            { type: ActionConstants.SAVE_USER_PENDING, actionFlag: ACTION_FLAG.CREATE_ENTITY },
            { type: ActionConstants.SAVE_USER_SUCCESS, actionFlag: ACTION_FLAG.CREATE_ENTITY, user},
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
            { type: ActionConstants.SAVE_USER_PENDING, actionFlag: ACTION_FLAG.CREATE_ENTITY },
            { type: ActionConstants.SAVE_USER_ERROR, actionFlag: ACTION_FLAG.CREATE_ENTITY, error, user}
        ];

        MockApi.onPost('rest/users').reply(400, error);

        store.dispatch(actions.createUser(user));

        setTimeout(() => {
            expect(store.getActions()).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });

    it('creates UPDATE_USER_SUCCESS action when saving user successfully is done', function (done) {
        const expectedActions = [
            { type: ActionConstants.SAVE_USER_PENDING, actionFlag: ACTION_FLAG.UPDATE_ENTITY },
            { type: ActionConstants.SAVE_USER_SUCCESS, actionFlag: ACTION_FLAG.UPDATE_ENTITY, user},
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
            { type: ActionConstants.SAVE_USER_PENDING, actionFlag: ACTION_FLAG.UPDATE_ENTITY },
            { type: ActionConstants.SAVE_USER_ERROR, actionFlag: ACTION_FLAG.UPDATE_ENTITY, error, user}
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
});