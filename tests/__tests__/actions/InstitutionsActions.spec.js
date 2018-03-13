import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from "../../../js/actions/index";
import * as ActionConstants from "../../../js/constants/ActionConstants";
import MockAdapter from 'axios-mock-adapter';
import {TEST_TIMEOUT} from "../../constants/DefaultTestConstants";
import {axiosBackend} from "../../../js/actions";

const institutions = [{key: 786785600}, {key: 86875960}];

describe('Institutions synchronize actions', function () {
    it('should create an action to fetch all institutions', () => {
        const expectedAction = {
            type: ActionConstants.LOAD_INSTITUTIONS_PENDING,
        };
        expect(actions.loadInstitutionsPending()).toEqual(expectedAction)
    });

    it('should create an action to save fetched institutions', () => {
        const expectedAction = {
            type: ActionConstants.LOAD_INSTITUTIONS_SUCCESS,
            institutions
        };
        expect(actions.loadInstitutionsSuccess(institutions)).toEqual(expectedAction)
    });

    it('should create an action about error during fetching institutions', () => {
        const error = {message: 'error'};
        const expectedAction = {
            type: ActionConstants.LOAD_INSTITUTIONS_ERROR,
            error
        };
        expect(actions.loadInstitutionsError(error)).toEqual(expectedAction)
    });
});

const middlewares = [thunk.withExtraArgument(axiosBackend)];
const mockStore = configureMockStore(middlewares);

describe('Institutions asynchronize actions', function () {
    let store,
        MockApi;
    const error = {
            "message" : "An error has occurred.",
            "requestUri": "/rest/institutions/xxx"
        };

    beforeEach(() => {
        MockApi = new MockAdapter(axiosBackend);
        store = mockStore();
    });

    it('creates LOAD_INSTITUTIONS_SUCCESS action when loading institutions successfully is done', function (done) {
        const expectedActions = [
            { type: ActionConstants.LOAD_INSTITUTIONS_PENDING},
            { type: ActionConstants.LOAD_INSTITUTIONS_SUCCESS, institutions}
        ];

        MockApi.onGet('rest/institutions').reply(200, institutions);

        store.dispatch(actions.loadInstitutions());

        setTimeout(() => {
            expect(store.getActions()).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });

    it('creates LOAD_INSTITUTIONS_ERROR action if an error occurred during loading institutions', function (done) {
        const expectedActions = [
            { type: ActionConstants.LOAD_INSTITUTIONS_PENDING},
            { type: ActionConstants.LOAD_INSTITUTIONS_ERROR, error}
        ];

        MockApi.onGet('rest/institutions').reply(400, error);

        store.dispatch(actions.loadInstitutions());

        setTimeout(() => {
            expect(store.getActions()).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });
});