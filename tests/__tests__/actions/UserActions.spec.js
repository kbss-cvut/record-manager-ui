import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as ActionConstants from "../../../js/constants/ActionConstants";
import MockAdapter from 'axios-mock-adapter';
import {ACTION_FLAG, ROLE} from "../../../js/constants/DefaultConstants";
import {TEST_TIMEOUT} from "../../constants/DefaultTestConstants";
import {axiosBackend} from "../../../js/actions";
import {
    changePassword,
    createUser, deleteInvitationOption,
    deleteUser,
    deleteUserError,
    deleteUserPending,
    deleteUserSuccess, generateUsername, impersonate,
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
    saveUserSuccess, sendInvitation, unloadInstitutionMembers,
    unloadSavedUser,
    unloadUser,
    updateUser
} from "../../../js/actions/UserActions";
import {API_URL} from '../../../config';
import en from "../../../js/i18n/en";

const members = [
    {username: 'record1'},
    {username: 'record2'}
];

describe('User synchronous actions', function () {
    const user = {username: 'test'},
        error = {message: 'error'};

    it('creates an action to save user', () => {
        const actionFlag = ACTION_FLAG.CREATE_ENTITY;
        const expectedAction = {
            type: ActionConstants.SAVE_USER_PENDING,
            actionFlag
        };
        expect(saveUserPending(actionFlag)).toEqual(expectedAction)
    });

    it('creates an action to announce successful save of user', () => {
        const actionFlag = ACTION_FLAG.CREATE_ENTITY;
        const expectedAction = {
            type: ActionConstants.SAVE_USER_SUCCESS,
            user,
            actionFlag
        };
        expect(saveUserSuccess(user, actionFlag)).toEqual(expectedAction)
    });

    it('creates an action to announce unsuccessful save of user', () => {
        const actionFlag = ACTION_FLAG.UPDATE_ENTITY;
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

    it('creates an action to delete user', () => {
        const username = user.username;
        const expectedAction = {
            type: ActionConstants.DELETE_USER_PENDING,
            username
        };
        expect(deleteUserPending(username)).toEqual(expectedAction)
    });

    it('creates an action to announce successful delete of user', () => {
        const expectedAction = {
            type: ActionConstants.DELETE_USER_SUCCESS,
            user
        };
        expect(deleteUserSuccess(user)).toEqual(expectedAction)
    });

    it('creates an action to announce unsuccessful delete of user', () => {
        const expectedAction = {
            type: ActionConstants.DELETE_USER_ERROR,
            error,
            user
        };
        expect(deleteUserError(error, user)).toEqual(expectedAction)
    });

    it('creates an action to fetch user', () => {
        const expectedAction = {
            type: ActionConstants.LOAD_USER_PENDING,
        };
        expect(loadUserPending()).toEqual(expectedAction)
    });

    it('creates an action to save fetched user', () => {
        const expectedAction = {
            type: ActionConstants.LOAD_USER_SUCCESS,
            user
        };
        expect(loadUserSuccess(user)).toEqual(expectedAction)
    });

    it('creates an action about error during fetching user', () => {
        const expectedAction = {
            type: ActionConstants.LOAD_USER_ERROR,
            error
        };
        expect(loadUserError(error)).toEqual(expectedAction)
    });

    it('creates an action to unload loaded user', () => {
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

    it('creates an action to unload institution members', () => {
        const expectedAction = {
            type: ActionConstants.UNLOAD_INSTITUTION_MEMBERS
        };
        expect(unloadInstitutionMembers()).toEqual(expectedAction)
    });
});

const middlewares = [thunk.withExtraArgument(axiosBackend)];
const mockStore = configureMockStore(middlewares);

describe('User asynchronous actions', function () {
    let store,
        mockApi;
    const user = {username: 'test'},
        users = [
            {username: 'test1'},
            {username: 'test2'}
        ],
        institutionKey = 92979802112,
        error = {
            "message": "An error has occurred.",
            "requestUri": "/rest/users/xxx"
        },
        username = 'test',
        password = {
            newPassword: 'aaaa',
            currentPassword: '1234'
        },
        currentUserAdmin = {
            role: ROLE.ADMIN
        },
        usernamePrefix = 'doctor';

    beforeEach(() => {
        mockApi = new MockAdapter(axiosBackend);
        store = mockStore({intl: en});
    });

    it('creates SAVE_USER_SUCCESS action when saving user successfully is done', function (done) {
        const expectedActions = [
            {type: ActionConstants.SAVE_USER_PENDING, actionFlag: ACTION_FLAG.CREATE_ENTITY},
            {type: ActionConstants.SAVE_USER_SUCCESS, actionFlag: ACTION_FLAG.CREATE_ENTITY, user},
            {type: ActionConstants.LOAD_USERS_PENDING},
            {type: ActionConstants.LOAD_USERS_SUCCESS, users},
        ];

        mockApi.onPost(`${API_URL}/rest/users`).reply(200);
        mockApi.onGet(`${API_URL}/rest/users`).reply(200, users);

        store.dispatch(createUser(user));

        setTimeout(() => {
            expect(store.getActions()).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });

    it('creates SAVE_USER_ERROR action if an error occurred during creating user', function (done) {
        const expectedActions = [
            {type: ActionConstants.SAVE_USER_PENDING, actionFlag: ACTION_FLAG.CREATE_ENTITY},
            {type: ActionConstants.SAVE_USER_ERROR, actionFlag: ACTION_FLAG.CREATE_ENTITY, error, user}
        ];

        mockApi.onPost(`${API_URL}/rest/users`).reply(400, error);

        store.dispatch(createUser(user));

        setTimeout(() => {
            expect(store.getActions()).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });

    it('creates UPDATE_USER_SUCCESS action when saving user successfully is done', function (done) {
        const expectedActions = [
            {type: ActionConstants.SAVE_USER_PENDING, actionFlag: ACTION_FLAG.UPDATE_ENTITY},
            {type: ActionConstants.SAVE_USER_SUCCESS, actionFlag: ACTION_FLAG.UPDATE_ENTITY, user},
            {type: ActionConstants.LOAD_USERS_PENDING},
        ];

        mockApi.onPut(`${API_URL}/rest/users/${user.username}`).reply(200);
        mockApi.onGet(`${API_URL}/rest/users`).reply(200, users);

        store.dispatch(updateUser(user, currentUserAdmin));

        setTimeout(() => {
            expect(store.getActions().slice(0, 3)).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });

    it('creates SAVE_USER_ERROR action if an error occurred during updating user', function (done) {
        const expectedActions = [
            {type: ActionConstants.SAVE_USER_PENDING, actionFlag: ACTION_FLAG.UPDATE_ENTITY},
            {type: ActionConstants.SAVE_USER_ERROR, actionFlag: ACTION_FLAG.UPDATE_ENTITY, error, user}
        ];

        mockApi.onPut(`${API_URL}/rest/users/${user.username}`).reply(400, error);

        store.dispatch(updateUser(user, currentUserAdmin));

        setTimeout(() => {
            expect(store.getActions().slice(0, 2)).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });

    it('creates DELETE_USER_SUCCESS action when deleting user successfully is done', function (done) {
        const expectedActions = [
            {type: ActionConstants.DELETE_USER_PENDING, username},
            {type: ActionConstants.LOAD_USERS_PENDING},
            {type: ActionConstants.DELETE_USER_SUCCESS, user},
        ];

        mockApi.onDelete(`${API_URL}/rest/users/${user.username}`).reply(200);
        mockApi.onGet(`${API_URL}/rest/users`).reply(200, users);

        store.dispatch(deleteUser(user));

        setTimeout(() => {
            expect(store.getActions().slice(0, 3)).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });

    it('creates DELETE_USER_ERROR action if an error occurred during deleting user', function (done) {
        const expectedActions = [
            {type: ActionConstants.DELETE_USER_PENDING, username},
            {type: ActionConstants.DELETE_USER_ERROR, error, user}
        ];

        mockApi.onDelete(`${API_URL}/rest/users/${user.username}`).reply(400, error);

        store.dispatch(deleteUser(user));

        setTimeout(() => {
            expect(store.getActions().slice(0, 2)).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });

    it('creates LOAD_USER_SUCCESS action when loading user successfully is done', function (done) {
        const expectedActions = [
            {type: ActionConstants.LOAD_USER_PENDING},
            {type: ActionConstants.LOAD_USER_SUCCESS, user}
        ];

        mockApi.onGet(`${API_URL}/rest/users/${user.username}`).reply(200, {username});

        store.dispatch(loadUser(user.username));

        setTimeout(() => {
            expect(store.getActions()).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });

    it('creates LOAD_USER_ERROR action if an error occurred during loading user', function (done) {
        const expectedActions = [
            {type: ActionConstants.LOAD_USER_PENDING},
            {type: ActionConstants.LOAD_USER_ERROR, error}
        ];

        mockApi.onGet(`${API_URL}/rest/users/${user.username}`).reply(400, error);

        store.dispatch(loadUser(user.username));

        setTimeout(() => {
            expect(store.getActions().slice(0, 2)).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });

    it("creates LOAD_INSTITUTION_MEMBERS_SUCCESS action when loading institution's memebrs successfully is done", function (done) {
        const expectedActions = [
            {type: ActionConstants.LOAD_INSTITUTION_MEMBERS_PENDING},
            {type: ActionConstants.LOAD_INSTITUTION_MEMBERS_SUCCESS, members}
        ];

        mockApi.onGet(`${API_URL}/rest/users?institution=${institutionKey}`).reply(200, members);

        store.dispatch(loadInstitutionMembers(institutionKey));

        setTimeout(() => {
            expect(store.getActions()).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });

    it("creates LOAD_INSTITUTION_MEMBERS_ERROR action if an error occurred during loading institution's memebrs", function (done) {
        const expectedActions = [
            {type: ActionConstants.LOAD_INSTITUTION_MEMBERS_PENDING},
            {type: ActionConstants.LOAD_INSTITUTION_MEMBERS_ERROR, error}
        ];

        mockApi.onGet(`${API_URL}/rest/users?institution=${institutionKey}`).reply(400, error);

        store.dispatch(loadInstitutionMembers(institutionKey));

        setTimeout(() => {
            expect(store.getActions().slice(0, 2)).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });

    it("creates PASSWORD_CHANGE_SUCCESS action when changing password successfully is done", function (done) {
        const expectedActions = [
            {type: ActionConstants.PASSWORD_CHANGE_PENDING},
            {type: ActionConstants.PASSWORD_CHANGE_SUCCESS}
        ];

        mockApi.onPut(`${API_URL}/rest/users/${username}/password-change`).reply(200);

        store.dispatch(changePassword(username, password));

        setTimeout(() => {
            expect(store.getActions()).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });

    it("creates PASSWORD_CHANGE_ERROR action if an error occurred during changing password", function (done) {
        const expectedActions = [
            {type: ActionConstants.PASSWORD_CHANGE_PENDING},
            {type: ActionConstants.PASSWORD_CHANGE_ERROR, error}
        ];

        mockApi.onPut(`${API_URL}/rest/users/${username}/password-change`).reply(400, error);

        store.dispatch(changePassword(username, password));

        setTimeout(() => {
            expect(store.getActions()).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });

    it("creates GENERATE_USERNAME_SUCCESS action when changing password successfully is done", function (done) {
        const expectedActions = [
            {type: ActionConstants.GENERATE_USERNAME_PENDING},
            {type: ActionConstants.GENERATE_USERNAME_SUCCESS, generatedUsername: `${usernamePrefix}1`}
        ];

        mockApi.onGet(`${API_URL}/rest/users/generate-username/${usernamePrefix}`).reply(200, `${usernamePrefix}1`);

        store.dispatch(generateUsername(usernamePrefix));

        setTimeout(() => {
            expect(store.getActions()).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });

    it("creates SEND_INVITATION_SUCCESS action when user is invited successfully", function (done) {
        const expectedActions = [
            {type: ActionConstants.SEND_INVITATION_PENDING, username},
            {type: ActionConstants.SEND_INVITATION_SUCCESS, username},
            {type: ActionConstants.LOAD_USER_PENDING}
        ];

        mockApi.onGet(`${API_URL}/rest/users/${user.username}`).reply(200, {username});
        mockApi.onPut(`${API_URL}/rest/users/send-invitation/${username}`).reply(200);

        store.dispatch(sendInvitation(username));

        setTimeout(() => {
            expect(store.getActions().slice(0, 3)).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });

    it("creates SEND_INVITATION_ERROR action if an error occurred during user invitation", function (done) {
        const expectedActions = [
            {type: ActionConstants.SEND_INVITATION_PENDING, username},
            {type: ActionConstants.SEND_INVITATION_ERROR, error},
            {type: ActionConstants.LOAD_USER_PENDING}
        ];

        mockApi.onGet(`${API_URL}/rest/users/${user.username}`).reply(200, {username});
        mockApi.onPut(`${API_URL}/rest/users/send-invitation/${username}`).reply(400, error);

        store.dispatch(sendInvitation(username));

        setTimeout(() => {
            expect(store.getActions().slice(0, 3)).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });

    it("creates INVITATION_OPTION_DELETE_SUCCESS action when option to invite user is deleted successfully", function (done) {
        const expectedActions = [
            {type: ActionConstants.INVITATION_OPTION_DELETE_PENDING, username},
            {type: ActionConstants.INVITATION_OPTION_DELETE_SUCCESS, username},
            {type: ActionConstants.LOAD_USER_PENDING}
        ];

        mockApi.onGet(`${API_URL}/rest/users/${user.username}`).reply(200, {username});
        mockApi.onPost(`${API_URL}/rest/users/send-invitation/delete`).reply(200);

        store.dispatch(deleteInvitationOption(username));

        setTimeout(() => {
            expect(store.getActions().slice(0, 3)).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });

    it("creates INVITATION_OPTION_DELETE_ERROR action if an error occurred during deleting option to invite user", function (done) {
        const expectedActions = [
            {type: ActionConstants.INVITATION_OPTION_DELETE_PENDING, username},
            {type: ActionConstants.INVITATION_OPTION_DELETE_ERROR, error},
            {type: ActionConstants.LOAD_USER_PENDING}
        ];

        mockApi.onGet(`${API_URL}/rest/users/${user.username}`).reply(200, {username});
        mockApi.onPost(`${API_URL}/rest/users/send-invitation/delete`).reply(400, error);

        store.dispatch(deleteInvitationOption(username));

        setTimeout(() => {
            expect(store.getActions().slice(0, 3)).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });

    it("creates IMPERSONATE_SUCCESS action when user is successfully impersonated", function (done) {
        const {location} = window;
        delete window.location;
        window.location = {reload: jest.fn()};
        
        const expectedActions = [
            {type: ActionConstants.IMPERSONATE_PENDING},
            {type: ActionConstants.IMPERSONATE_SUCCESS, username}
        ];

        mockApi.onPost(`${API_URL}/rest/users/impersonate`).reply(200);

        store.dispatch(impersonate(username));

        setTimeout(() => {
            expect(store.getActions().slice(0, 2)).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });

    it("creates IMPERSONATE_ERROR action if an error occurred during impersonating user", function (done) {
        const expectedActions = [
            {type: ActionConstants.IMPERSONATE_PENDING},
            {type: ActionConstants.IMPERSONATE_ERROR, error}
        ];

        mockApi.onPost(`${API_URL}/rest/users/impersonate`).reply(400, error);

        store.dispatch(impersonate(username));

        setTimeout(() => {
            expect(store.getActions().slice(0, 2)).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });

});
