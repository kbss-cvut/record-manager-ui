import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from "../../../js/actions/index";
import * as ActionConstants from "../../../js/constants/ActionConstants";
import MockAdapter from 'axios-mock-adapter';
import {ACTION_FLAG} from "../../../js/constants/DefaultConstants";
import {TEST_TIMEOUT} from "../../constants/DefaultTestConstants";
import {axiosBackend} from "../../../js/actions";

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
        expect(actions.saveInstitutionPending(actionFlag)).toEqual(expectedAction)
    });

    it('creates an action to announce successful save of institution', () => {
        const actionFlag = ACTION_FLAG.CREATE_ENTITY ;
        const expectedAction = {
            type: ActionConstants.SAVE_INSTITUTION_SUCCESS,
            institution,
            key,
            actionFlag
        };
        expect(actions.saveInstitutionSuccess(institution, key, actionFlag)).toEqual(expectedAction)
    });

    it('creates an action to announce unsuccessful save of institution', () => {
        const actionFlag = ACTION_FLAG.UPDATE_ENTITY ;
        const expectedAction = {
            type: ActionConstants.SAVE_INSTITUTION_ERROR,
            error,
            institution,
            actionFlag,
        };
        expect(actions.saveInstitutionError(error, institution, actionFlag)).toEqual(expectedAction)
    });

    it('creates an action to delete institution', () => {
        const expectedAction = {
            type: ActionConstants.DELETE_INSTITUTION_PENDING,
            key
        };
        expect(actions.deleteInstitutionPending(key)).toEqual(expectedAction)
    });

    it('creates an action to announce successful delete of institution', () => {
        const expectedAction = {
            type: ActionConstants.DELETE_INSTITUTION_SUCCESS,
            institution
        };
        expect(actions.deleteInstitutionSuccess(institution)).toEqual(expectedAction)
    });

    it('creates an action to announce unsuccessful delete of institution', () => {
        const expectedAction = {
            type: ActionConstants.DELETE_INSTITUTION_ERROR,
            error,
            institution
        };
        expect(actions.deleteInstitutionError(error, institution)).toEqual(expectedAction)
    });

    it('creates an action to fetch institution', () => {
        const expectedAction = {
            type: ActionConstants.LOAD_INSTITUTION_PENDING,
        };
        expect(actions.loadInstitutionPending()).toEqual(expectedAction)
    });

    it('creates an action to save fetched institution', () => {
        const expectedAction = {
            type: ActionConstants.LOAD_INSTITUTION_SUCCESS,
            institution
        };
        expect(actions.loadInstitutionSuccess(institution)).toEqual(expectedAction)
    });

    it('creates an action about error during fetching institution', () => {
        const expectedAction = {
            type: ActionConstants.LOAD_INSTITUTION_ERROR,
            error
        };
        expect(actions.loadInstitutionError(error)).toEqual(expectedAction)
    });

    it('creates an action to unload loaded institution', () => {
        const expectedAction = {
            type: ActionConstants.UNLOAD_INSTITUTION,
        };
        expect(actions.unloadInstitution()).toEqual(expectedAction)
    });
});

const middlewares = [thunk.withExtraArgument(axiosBackend)];
const mockStore = configureMockStore(middlewares);

describe('Institution asynchronize actions', function () {
    let store,
        MockApi;
    const institution = {key: 696875909},
        institutions = [
            {key: 7986787608},
            {key: 8968756596}
        ],
        key = '696875909',
        location = `rest/institutions/${key}`,
        error = {
            "message" : "An error has occurred.",
            "requestUri": "/rest/institutions/xxx"
        };

    beforeEach(() => {
        MockApi = new MockAdapter(axiosBackend);
        store = mockStore();
    });

    it('creates SAVE_INSTITUTION_SUCCESS action when saving institution successfully is done', function (done) {
        const expectedActions = [
            { type: ActionConstants.SAVE_INSTITUTION_PENDING, actionFlag: ACTION_FLAG.CREATE_ENTITY },
            { type: ActionConstants.SAVE_INSTITUTION_SUCCESS, key, actionFlag: ACTION_FLAG.CREATE_ENTITY, institution},
            { type: ActionConstants.LOAD_INSTITUTIONS_PENDING},
            { type: ActionConstants.LOAD_INSTITUTIONS_SUCCESS, institutions},
        ];

        MockApi.onPost('rest/institutions').reply(200, null, {location});
        MockApi.onGet('rest/institutions').reply(200, institutions);

        store.dispatch(actions.createInstitution(institution));

        setTimeout(() => {
            expect(store.getActions()).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });

    it('creates SAVE_INSTITUTION_ERROR action if an error occurred during creating institution', function (done) {
        const expectedActions = [
            { type: ActionConstants.SAVE_INSTITUTION_PENDING, actionFlag: ACTION_FLAG.CREATE_ENTITY },
            { type: ActionConstants.SAVE_INSTITUTION_ERROR, actionFlag: ACTION_FLAG.CREATE_ENTITY, error, institution}
        ];

        MockApi.onPost('rest/institutions').reply(400, error);

        store.dispatch(actions.createInstitution(institution));

        setTimeout(() => {
            expect(store.getActions()).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });

    it('creates UPDATE_INSTITUTION_SUCCESS action when saving institution successfully is done', function (done) {
        const expectedActions = [
            { type: ActionConstants.SAVE_INSTITUTION_PENDING, actionFlag: ACTION_FLAG.UPDATE_ENTITY },
            { type: ActionConstants.SAVE_INSTITUTION_SUCCESS, key: null, actionFlag: ACTION_FLAG.UPDATE_ENTITY, institution},
            { type: ActionConstants.LOAD_INSTITUTIONS_PENDING},
            { type: ActionConstants.LOAD_INSTITUTIONS_SUCCESS, institutions},
        ];

        MockApi.onPut(`rest/institutions/${institution.key}`).reply(200, null, {location});
        MockApi.onGet('rest/institutions').reply(200, institutions);

        store.dispatch(actions.updateInstitution(institution));

        setTimeout(() => {
            expect(store.getActions()).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });

    it('creates SAVE_INSTITUTION_ERROR action if an error occurred during updating institution', function (done) {
        const expectedActions = [
            { type: ActionConstants.SAVE_INSTITUTION_PENDING, actionFlag: ACTION_FLAG.UPDATE_ENTITY },
            { type: ActionConstants.SAVE_INSTITUTION_ERROR, actionFlag: ACTION_FLAG.UPDATE_ENTITY, error, institution}
        ];

        MockApi.onPut(`rest/institutions/${institution.key}`).reply(400, error);

        store.dispatch(actions.updateInstitution(institution));

        setTimeout(() => {
            expect(store.getActions()).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });

    it('creates DELETE_INSTITUTION_SUCCESS action when deleting institution successfully is done', function (done) {
        const expectedActions = [
            { type: ActionConstants.DELETE_INSTITUTION_PENDING, key: institution.key},
            { type: ActionConstants.LOAD_INSTITUTIONS_PENDING},
            { type: ActionConstants.DELETE_INSTITUTION_SUCCESS, institution},
            { type: ActionConstants.LOAD_INSTITUTIONS_SUCCESS, institutions},
        ];

        MockApi.onDelete(`rest/institutions/${institution.key}`).reply(200);
        MockApi.onGet('rest/institutions').reply(200, institutions);

        store.dispatch(actions.deleteInstitution(institution));

        setTimeout(() => {
            expect(store.getActions()).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });

    it('creates SAVE_INSTITUTION_ERROR action if an error occurred during updating institution', function (done) {
        const expectedActions = [
            { type: ActionConstants.DELETE_INSTITUTION_PENDING, key: institution.key},
            { type: ActionConstants.DELETE_INSTITUTION_ERROR, error, institution}
        ];

        MockApi.onDelete(`rest/institutions/${institution.key}`).reply(400, error);

        store.dispatch(actions.deleteInstitution(institution));

        setTimeout(() => {
            expect(store.getActions()).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });

    it('creates LOAD_INSTITUTION_SUCCESS action when loading institution successfully is done', function (done) {
        const expectedActions = [
            { type: ActionConstants.LOAD_INSTITUTION_PENDING},
            { type: ActionConstants.LOAD_INSTITUTION_SUCCESS, institution}
        ];

        MockApi.onGet(`rest/institutions/${institution.key}`).reply(200, {key: institution.key});

        store.dispatch(actions.loadInstitution(institution.key));

        setTimeout(() => {
            expect(store.getActions()).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });

    it('creates LOAD_INSTITUTION_ERROR action if an error occurred during loading institution', function (done) {
        const expectedActions = [
            { type: ActionConstants.LOAD_INSTITUTION_PENDING},
            { type: ActionConstants.LOAD_INSTITUTION_ERROR, error}
        ];

        MockApi.onGet(`rest/institutions/${institution.key}`).reply(400, error);

        store.dispatch(actions.loadInstitution(institution.key));

        setTimeout(() => {
            expect(store.getActions()).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });
});