import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as ActionConstants from "../../../js/constants/ActionConstants";
import MockAdapter from 'axios-mock-adapter';
import {ACTION_FLAG} from "../../../js/constants/DefaultConstants";
import {TEST_TIMEOUT} from "../../constants/DefaultTestConstants";
import {axiosBackend} from "../../../js/actions";
import {
    createInstitution,
    deleteInstitution,
    deleteInstitutionError,
    deleteInstitutionPending,
    deleteInstitutionSuccess,
    loadInstitution,
    loadInstitutionError,
    loadInstitutionPending,
    loadInstitutionSuccess,
    saveInstitutionError,
    saveInstitutionPending,
    saveInstitutionSuccess,
    unloadInstitution,
    unloadSavedInstitution,
    updateInstitution
} from "../../../js/actions/InstitutionActions";
import {API_URL} from '../../../config';
import en from "../../../js/i18n/en";

describe('Institution synchronize actions', function () {
    const institution = {key: 7979868757},
        key = 7979868757,
        error = {message: 'error'};

    it('creates an action to save institution', () => {
        const actionFlag = ACTION_FLAG.CREATE_ENTITY;
        const expectedAction = {
            type: ActionConstants.SAVE_INSTITUTION_PENDING,
            actionFlag
        };
        expect(saveInstitutionPending(actionFlag)).toEqual(expectedAction)
    });

    it('creates an action to announce successful save of institution', () => {
        const actionFlag = ACTION_FLAG.CREATE_ENTITY;
        const expectedAction = {
            type: ActionConstants.SAVE_INSTITUTION_SUCCESS,
            institution,
            key,
            actionFlag
        };
        expect(saveInstitutionSuccess(institution, key, actionFlag)).toEqual(expectedAction)
    });

    it('creates an action to announce unsuccessful save of institution', () => {
        const actionFlag = ACTION_FLAG.UPDATE_ENTITY;
        const expectedAction = {
            type: ActionConstants.SAVE_INSTITUTION_ERROR,
            error,
            institution,
            actionFlag,
        };
        expect(saveInstitutionError(error, institution, actionFlag)).toEqual(expectedAction)
    });

    it('creates an action to unload saved institution', () => {
        const expectedAction = {
            type: ActionConstants.UNLOAD_SAVED_INSTITUTION
        };
        expect(unloadSavedInstitution()).toEqual(expectedAction)
    });

    it('creates an action to delete institution', () => {
        const expectedAction = {
            type: ActionConstants.DELETE_INSTITUTION_PENDING,
            key
        };
        expect(deleteInstitutionPending(key)).toEqual(expectedAction)
    });

    it('creates an action to announce successful delete of institution', () => {
        const expectedAction = {
            type: ActionConstants.DELETE_INSTITUTION_SUCCESS,
            institution
        };
        expect(deleteInstitutionSuccess(institution)).toEqual(expectedAction)
    });

    it('creates an action to announce unsuccessful delete of institution', () => {
        const expectedAction = {
            type: ActionConstants.DELETE_INSTITUTION_ERROR,
            error,
            institution
        };
        expect(deleteInstitutionError(error, institution)).toEqual(expectedAction)
    });

    it('creates an action to fetch institution', () => {
        const expectedAction = {
            type: ActionConstants.LOAD_INSTITUTION_PENDING,
        };
        expect(loadInstitutionPending()).toEqual(expectedAction)
    });

    it('creates an action to save fetched institution', () => {
        const expectedAction = {
            type: ActionConstants.LOAD_INSTITUTION_SUCCESS,
            institution
        };
        expect(loadInstitutionSuccess(institution)).toEqual(expectedAction)
    });

    it('creates an action about error during fetching institution', () => {
        const expectedAction = {
            type: ActionConstants.LOAD_INSTITUTION_ERROR,
            error
        };
        expect(loadInstitutionError(error)).toEqual(expectedAction)
    });

    it('creates an action to unload loaded institution', () => {
        const expectedAction = {
            type: ActionConstants.UNLOAD_INSTITUTION,
        };
        expect(unloadInstitution()).toEqual(expectedAction)
    });
});

const middlewares = [thunk.withExtraArgument(axiosBackend)];
const mockStore = configureMockStore(middlewares);

describe('Institution asynchronous actions', function () {
    let store,
        mockApi;
    const institution = {key: 696875909},
        institutions = [
            {key: 7986787608},
            {key: 8968756596}
        ],
        key = '696875909',
        location = `rest/institutions/${key}`,
        error = {
            "message": "An error has occurred.",
            "requestUri": "/rest/institutions/xxx"
        };

    beforeEach(() => {
        mockApi = new MockAdapter(axiosBackend);
        store = mockStore({intl: en});
    });

    it('creates SAVE_INSTITUTION_SUCCESS action when saving institution successfully is done', function (done) {
        const expectedActions = [
            {type: ActionConstants.SAVE_INSTITUTION_PENDING, actionFlag: ACTION_FLAG.CREATE_ENTITY},
            {type: ActionConstants.SAVE_INSTITUTION_SUCCESS, key, actionFlag: ACTION_FLAG.CREATE_ENTITY, institution},
            {type: ActionConstants.LOAD_INSTITUTIONS_PENDING},
        ];

        mockApi.onPost(`${API_URL}/rest/institutions`).reply(200, null, {location});
        mockApi.onGet(`${API_URL}/rest/institutions`).reply(200, institutions);

        store.dispatch(createInstitution(institution));

        setTimeout(() => {
            expect(store.getActions().slice(0, 3)).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });

    it('creates SAVE_INSTITUTION_ERROR action if an error occurred during creating institution', function (done) {
        const expectedActions = [
            {type: ActionConstants.SAVE_INSTITUTION_PENDING, actionFlag: ACTION_FLAG.CREATE_ENTITY},
            {type: ActionConstants.SAVE_INSTITUTION_ERROR, actionFlag: ACTION_FLAG.CREATE_ENTITY, error, institution}
        ];

        mockApi.onPost(`${API_URL}/rest/institutions`).reply(400, error);

        store.dispatch(createInstitution(institution));

        setTimeout(() => {
            expect(store.getActions()).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });

    it('creates UPDATE_INSTITUTION_SUCCESS action when saving institution successfully is done', function (done) {
        const expectedActions = [
            {type: ActionConstants.SAVE_INSTITUTION_PENDING, actionFlag: ACTION_FLAG.UPDATE_ENTITY},
            {
                type: ActionConstants.SAVE_INSTITUTION_SUCCESS,
                key: null,
                actionFlag: ACTION_FLAG.UPDATE_ENTITY,
                institution
            },
            {type: ActionConstants.LOAD_INSTITUTIONS_PENDING}
        ];

        mockApi.onPut(`${API_URL}/rest/institutions/${institution.key}`).reply(200, null, {location});
        mockApi.onGet(`${API_URL}/rest/institutions`).reply(200, institutions);

        store.dispatch(updateInstitution(institution));

        setTimeout(() => {
            expect(store.getActions().slice(0, 3)).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });

    it('creates SAVE_INSTITUTION_ERROR action if an error occurred during updating institution', function (done) {
        const expectedActions = [
            {type: ActionConstants.SAVE_INSTITUTION_PENDING, actionFlag: ACTION_FLAG.UPDATE_ENTITY},
            {type: ActionConstants.SAVE_INSTITUTION_ERROR, actionFlag: ACTION_FLAG.UPDATE_ENTITY, error, institution}
        ];

        mockApi.onPut(`${API_URL}/rest/institutions/${institution.key}`).reply(400, error);

        store.dispatch(updateInstitution(institution));

        setTimeout(() => {
            expect(store.getActions()).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });

    it('creates DELETE_INSTITUTION_SUCCESS action when deleting institution successfully is done', function (done) {
        const expectedActions = [
            {type: ActionConstants.DELETE_INSTITUTION_PENDING, key: institution.key},
            {type: ActionConstants.LOAD_INSTITUTIONS_PENDING},
            {type: ActionConstants.DELETE_INSTITUTION_SUCCESS, institution},
        ];

        mockApi.onDelete(`${API_URL}/rest/institutions/${institution.key}`).reply(200);
        mockApi.onGet(`${API_URL}/rest/institutions`).reply(200, institutions);

        store.dispatch(deleteInstitution(institution));

        setTimeout(() => {
            expect(store.getActions().slice(0, 3)).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });

    it('creates SAVE_INSTITUTION_ERROR action if an error occurred during updating institution', function (done) {
        const expectedActions = [
            {type: ActionConstants.DELETE_INSTITUTION_PENDING, key: institution.key},
            {type: ActionConstants.DELETE_INSTITUTION_ERROR, error, institution}
        ];

        mockApi.onDelete(`${API_URL}/rest/institutions/${institution.key}`).reply(400, error);

        store.dispatch(deleteInstitution(institution));

        setTimeout(() => {
            expect(store.getActions().slice(0, 2)).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });

    it('creates LOAD_INSTITUTION_SUCCESS action when loading institution successfully is done', function (done) {
        const expectedActions = [
            {type: ActionConstants.LOAD_INSTITUTION_PENDING},
            {type: ActionConstants.LOAD_INSTITUTION_SUCCESS, institution}
        ];

        mockApi.onGet(`${API_URL}/rest/institutions/${institution.key}`).reply(200, {key: institution.key});

        store.dispatch(loadInstitution(institution.key));

        setTimeout(() => {
            expect(store.getActions().slice(0, 2)).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });

    it('creates LOAD_INSTITUTION_ERROR action if an error occurred during loading institution', function (done) {
        const expectedActions = [
            {type: ActionConstants.LOAD_INSTITUTION_PENDING},
            {type: ActionConstants.LOAD_INSTITUTION_ERROR, error}
        ];

        mockApi.onGet(`${API_URL}/rest/institutions/${institution.key}`).reply(400, error);

        store.dispatch(loadInstitution(institution.key));

        setTimeout(() => {
            expect(store.getActions().slice(0, 2)).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });
});