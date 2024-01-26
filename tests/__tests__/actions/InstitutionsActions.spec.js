import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as ActionConstants from "../../../js/constants/ActionConstants";
import MockAdapter from 'axios-mock-adapter';
import {TEST_TIMEOUT} from "../../constants/DefaultTestConstants";
import {axiosBackend} from "../../../js/actions";
import {
    loadInstitutions,
    loadInstitutionsError,
    loadInstitutionsPending,
    loadInstitutionsSuccess
} from "../../../js/actions/InstitutionsActions";
import {API_URL} from '../../../config';
import {mockDateNow, restoreDateNow} from "../../environment/Environment";
import {errorMessage} from "../../../js/model/Message";

const institutions = [{key: 786785600}, {key: 86875960}];

describe('Institutions synchronize actions', function () {
    it('creates an action to fetch all institutions', () => {
        const expectedAction = {
            type: ActionConstants.LOAD_INSTITUTIONS_PENDING,
        };
        expect(loadInstitutionsPending()).toEqual(expectedAction)
    });

    it('creates an action to save fetched institutions', () => {
        const expectedAction = {
            type: ActionConstants.LOAD_INSTITUTIONS_SUCCESS,
            institutions
        };
        expect(loadInstitutionsSuccess(institutions)).toEqual(expectedAction)
    });

    it('creates an action about error during fetching institutions', () => {
        const error = {message: 'error'};
        const expectedAction = {
            type: ActionConstants.LOAD_INSTITUTIONS_ERROR,
            error
        };
        expect(loadInstitutionsError(error)).toEqual(expectedAction)
    });
});

const middlewares = [thunk.withExtraArgument(axiosBackend)];
const mockStore = configureMockStore(middlewares);

describe('Institutions asynchronize actions', function () {
    let store,
        mockApi;
    const error = {
            "message" : "An error has occurred.",
            "requestUri": "/rest/institutions/xxx"
        };

    beforeEach(() => {
        mockApi = new MockAdapter(axiosBackend);
        store = mockStore();
        mockDateNow();
    });

    afterEach(() => {
        restoreDateNow();
    });

    it('creates LOAD_INSTITUTIONS_SUCCESS action when loading institutions successfully is done', function (done) {
        const expectedActions = [
            { type: ActionConstants.LOAD_INSTITUTIONS_PENDING},
            { type: ActionConstants.LOAD_INSTITUTIONS_SUCCESS, institutions}
        ];

        mockApi.onGet(`${API_URL}/rest/institutions`).reply(200, institutions);

        store.dispatch(loadInstitutions());

        setTimeout(() => {
            expect(store.getActions()).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });

    it('creates LOAD_INSTITUTIONS_ERROR action if an error occurred during loading institutions', function (done) {
        const expectedActions = [
            { type: ActionConstants.LOAD_INSTITUTIONS_PENDING},
            { type: ActionConstants.LOAD_INSTITUTIONS_ERROR, error},
            { type: ActionConstants.PUBLISH_MESSAGE, message: errorMessage('institutions.loading-error', {error: error.message})}
        ];

        mockApi.onGet(`${API_URL}/rest/institutions`).reply(400, error);

        store.dispatch(loadInstitutions());

        setTimeout(() => {
            expect(store.getActions()).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });
});