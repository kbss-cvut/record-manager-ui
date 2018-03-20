import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as ActionConstants from "../../../js/constants/ActionConstants";
import MockAdapter from 'axios-mock-adapter';
import {ACTION_FLAG} from "../../../js/constants/DefaultConstants";
import {TEST_TIMEOUT} from "../../constants/DefaultTestConstants";
import {axiosBackend} from "../../../js/actions";
import {
    changePassword,
    createUser,
    deleteUser,
    deleteUserError,
    deleteUserPending,
    deleteUserSuccess,
    loadInstitutionMembers,
    loadInstitutionMembersError,
    loadInstitutionMembersPending,
    loadInstitutionMembersSuccess,
    loadUser,
    loadUserError,
    loadUserPending,
    loadUserSuccess,
    saveUserError,
    saveUserPending,
    saveUserSuccess,
    unloadSavedUser,
    unloadUser,
    updateUser
} from "../../../js/actions/UserActions";

const members = [
        {username: 'record1'},
        {username: 'record2'}
    ];

describe('User synchronize actions', function () {
    const user = {username: 'test'},
          error = {message: 'error'};

    it('should create an action to save user', () => {
        const actionFlag = ACTION_FLAG.CREATE_ENTITY;
        const expectedAction = {
            type: ActionConstants.SAVE_USER_PENDING,
            actionFlag
        };
        expect(saveUserPending(actionFlag)).toEqual(expectedAction)
    });

    it('should create an action to announce successful save of user', () => {
        const actionFlag = ACTION_FLAG.CREATE_ENTITY ;
        const expectedAction = {
            type: ActionConstants.SAVE_USER_SUCCESS,
            user,
            actionFlag
        };
        expect(saveUserSuccess(user, actionFlag)).toEqual(expectedAction)
    });

    it('should create an action to announce unsuccessful save of user', () => {
        const actionFlag = ACTION_FLAG.UPDATE_ENTITY ;
        const expectedAction = {
            type: ActionConstants.SAVE_USER_ERROR,
            error,
            user,
            actionFlag,
        };
        expect(saveUserError(error, user, actionFlag)).toEqual(expectedAction)
    });

    it('creates an action to unload saved user', () => {
        const expectedAction = {
            type: ActionConstants.UNLOAD_SAVED_USER
        };
        expect(unloadSavedUser()).toEqual(expectedAction)
    });

    it('should create an action to delete user', () => {
        const username = user.username;
        const expectedAction = {
            type: ActionConstants.DELETE_USER_PENDING,
            username
        };
        expect(deleteUserPending(username)).toEqual(expectedAction)
    });

    it('should create an action to announce successful delete of user', () => {
        const expectedAction = {
            type: ActionConstants.DELETE_USER_SUCCESS,
            user
        };
        expect(deleteUserSuccess(user)).toEqual(expectedAction)
    });

    it('should create an action to announce unsuccessful delete of user', () => {
        const expectedAction = {
            type: ActionConstants.DELETE_USER_ERROR,
            error,
            user
        };
        expect(deleteUserError(error, user)).toEqual(expectedAction)
    });

    it('should create an action to fetch user', () => {
        const expectedAction = {
            type: ActionConstants.LOAD_USER_PENDING,
        };
        expect(loadUserPending()).toEqual(expectedAction)
    });

    it('should create an action to save fetched user', () => {
        const expectedAction = {
            type: ActionConstants.LOAD_USER_SUCCESS,
            user
        };
        expect(loadUserSuccess(user)).toEqual(expectedAction)
    });

    it('should create an action about error during fetching user', () => {
        const expectedAction = {
            type: ActionConstants.LOAD_USER_ERROR,
            error
        };
        expect(loadUserError(error)).toEqual(expectedAction)
    });

    it('should create an action to unload loaded user', () => {
        const expectedAction = {
            type: ActionConstants.UNLOAD_USER,
        };
        expect(unloadUser()).toEqual(expectedAction)
    });

    it("creates an action to fetch all institution's members", () => {
        const expectedAction = {
            type: ActionConstants.LOAD_INSTITUTION_MEMBERS_PENDING,
        };
        expect(loadInstitutionMembersPending()).toEqual(expectedAction)
    });

    it("creates an action to save fetched institution's members", () => {
        const expectedAction = {
            type: ActionConstants.LOAD_INSTITUTION_MEMBERS_SUCCESS,
            members
        };
        expect(loadInstitutionMembersSuccess(members)).toEqual(expectedAction)
    });

    it("creates an action about error during fetching institution's members", () => {
        const error = {message: 'error'};
        const expectedAction = {
            type: ActionConstants.LOAD_INSTITUTION_MEMBERS_ERROR,
            error
        };
        expect(loadInstitutionMembersError(error)).toEqual(expectedAction)
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
        institutionKey = 92979802112,
        error = {
            "message" : "An error has occurred.",
            "requestUri": "/rest/users/xxx"
        },
        username = 'test',
        password = {
            newPassword: 'aaaa',
            currentPassword: '1234'
        };

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

        store.dispatch(createUser(user));

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

        store.dispatch(createUser(user));

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

        store.dispatch(updateUser(user));

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

        store.dispatch(updateUser(user));

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

        store.dispatch(deleteUser(user));

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

        store.dispatch(deleteUser(user));

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

        store.dispatch(loadUser(user.username));

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

        store.dispatch(loadUser(user.username));

        setTimeout(() => {
            expect(store.getActions()).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });

    it("creates LOAD_INSTITUTION_MEMBERS_SUCCESS action when loading institution's memebrs successfully is done", function (done) {
        const expectedActions = [
            { type: ActionConstants.LOAD_INSTITUTION_MEMBERS_PENDING},
            { type: ActionConstants.LOAD_INSTITUTION_MEMBERS_SUCCESS, members}
        ];

        MockApi.onGet(`rest/users?institution=${institutionKey}`).reply(200, members);

        store.dispatch(loadInstitutionMembers(institutionKey));

        setTimeout(() => {
            expect(store.getActions()).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });

    it("creates LOAD_INSTITUTION_MEMBERS_ERROR action if an error occurred during loading institution's memebrs", function (done) {
        const expectedActions = [
            { type: ActionConstants.LOAD_INSTITUTION_MEMBERS_PENDING},
            { type: ActionConstants.LOAD_INSTITUTION_MEMBERS_ERROR, error}
        ];

        MockApi.onGet(`rest/users?institution=${institutionKey}`).reply(400, error);

        store.dispatch(loadInstitutionMembers(institutionKey));

        setTimeout(() => {
            expect(store.getActions()).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });

    it("creates PASSWORD_CHANGE_SUCCESS action when changing password successfully is done", function (done) {
        const expectedActions = [
            { type: ActionConstants.PASSWORD_CHANGE_PENDING},
            { type: ActionConstants.PASSWORD_CHANGE_SUCCESS}
        ];

        MockApi.onPut(`rest/users/${username}/password-change`).reply(200);

        store.dispatch(changePassword(username, password));

        setTimeout(() => {
            expect(store.getActions()).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });

    it("creates PASSWORD_CHANGE_ERROR action if an error occurred during chaning password", function (done) {
        const expectedActions = [
            { type: ActionConstants.PASSWORD_CHANGE_PENDING},
            { type: ActionConstants.PASSWORD_CHANGE_ERROR, error}
        ];

        MockApi.onPut(`rest/users/${username}/password-change`).reply(400, error);

        store.dispatch(changePassword(username, password));

        setTimeout(() => {
            expect(store.getActions()).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });

});