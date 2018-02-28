import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from "../../js/actions";
import * as ActionConstants from "../../js/constants/ActionConstants";
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {ACTION_FLAG} from "../../js/constants/DefaultConstants";

describe('Auth synchronize actions', function () {
    const user = {username: 'test'},
        error = {message: 'error'};

    it('should create an action that user was authenticated', () => {
        const expectedAction = {
            type: ActionConstants.AUTH_USER
        };
        expect(actions.userAuthSuccess()).toEqual(expectedAction)
    });

    it('should create an action that there was error during authentication', () => {
        const expectedAction = {
            type: ActionConstants.AUTH_USER_ERROR,
            error
        };
        expect(actions.userAuthError(error)).toEqual(expectedAction)
    });

    it('should create an action that user was unauthenticated', () => {
        const expectedAction = {
            type: ActionConstants.UNAUTH_USER
        };
        expect(actions.unauthUser()).toEqual(expectedAction)
    });

    it('should create an action to fetch current user', () => {
        const expectedAction = {
            type: ActionConstants.LOAD_USER_PROFILE_PENDING
        };
        expect(actions.loadUserProfilePending()).toEqual(expectedAction)
    });

    it('should create an action to save fetched current user', () => {
        const expectedAction = {
            type: ActionConstants.LOAD_USER_PROFILE_SUCCESS,
            user
        };
        expect(actions.loadUserProfileSuccess(user)).toEqual(expectedAction)
    });

    it('should create an action about error during fetching current user', () => {
        const expectedAction = {
            type: ActionConstants.LOAD_USER_PROFILE_ERROR,
            error
        };
        expect(actions.loadUserProfileError(error)).toEqual(expectedAction)
    });
});

const TEST_TIMEOUT = 300;
const middlewares = [thunk.withExtraArgument(axios)];
const mockStore = configureMockStore(middlewares);

describe('Auth asynchronize actions', function () {
    let store,
        MockApi;
    const user = {username: 'test', password: 'testPassword'},
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

    it('creates AUTH_USER action when logging in successfully is done', function (done) {
        const reply = {
            errorMessage: null,
            loggedIn: true,
            success: true,
            username: "test"
        };
        const expectedActions = [
            { type: ActionConstants.AUTH_USER },
            { type: ActionConstants.LOAD_USER_PROFILE_PENDING },
            { type: ActionConstants.LOAD_USER_PROFILE_SUCCESS, user}
        ];

        MockApi.onPost('j_spring_security_check').reply(200, reply);
        MockApi.onGet('rest/users/current').reply(200, user);

        store.dispatch(actions.login(user.username, user.password, null));

        setTimeout(() => {
            expect(store.getActions()).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });

    it('creates AUTH_USER_ERROR action when logging in fails', function (done) {
        const reply = {
            errorMessage: "User with username test not found.",
            loggedIn: false,
            success: false,
            username: null
        };
        const expectedActions = [
            { type: ActionConstants.AUTH_USER_ERROR, error: reply }
        ];

        MockApi.onPost('j_spring_security_check').reply(400, reply);

        store.dispatch(actions.login(user.username, user.password, null));

        setTimeout(() => {
            expect(store.getActions()).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });

    it('creates UNAUTH_USER action when user successfully logs out', function (done) {
        const expectedActions = [
            { type: ActionConstants.UNAUTH_USER }
        ];

        MockApi.onPost('j_spring_security_logout').reply(200);

        store.dispatch(actions.logout(user));

        setTimeout(() => {
            expect(store.getActions()).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });

    it('creates LOAD_USER_PROFILE_SUCCESS action when current user is successfully loaded', function (done) {
        const expectedActions = [
            { type: ActionConstants.LOAD_USER_PROFILE_PENDING },
            { type: ActionConstants.LOAD_USER_PROFILE_SUCCESS, user}
        ];

        MockApi.onGet('rest/users/current').reply(200, user);

        store.dispatch(actions.loadUserProfile());

        setTimeout(() => {
            expect(store.getActions()).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });

    it('creates LOAD_USER_PROFILE_ERROR action when current user is successfully loaded', function (done) {
        const expectedActions = [
            { type: ActionConstants.LOAD_USER_PROFILE_PENDING },
            { type: ActionConstants.LOAD_USER_PROFILE_ERROR, error }
        ];

        MockApi.onGet('rest/users/current').reply(400, error);

        store.dispatch(actions.loadUserProfile());

        setTimeout(() => {
            expect(store.getActions()).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });
});