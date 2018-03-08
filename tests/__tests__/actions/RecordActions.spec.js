import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from "../../../js/actions/index";
import * as ActionConstants from "../../../js/constants/ActionConstants";
import MockAdapter from 'axios-mock-adapter';
import {TEST_TIMEOUT} from "../../constants/DefaultTestConstants";
import {axiosBackend} from "../../../js/actions";

const patients = [
    {localName: 'record1'},
    {localName: 'record2'}
];

describe('Record synchronize actions', function () {
    it("creates an action to fetch all patient's records", () => {
        const expectedAction = {
            type: ActionConstants.LOAD_INSTITUTION_PATIENTS_PENDING,
        };
        expect(actions.loadInstitutionPatientsPending()).toEqual(expectedAction)
    });

    it("creates an action to save fetched patient's records", () => {
        const expectedAction = {
            type: ActionConstants.LOAD_INSTITUTION_PATIENTS_SUCCESS,
            patients
        };
        expect(actions.loadInstitutionPatientsSuccess(patients)).toEqual(expectedAction)
    });

    it("creates an action about error during fetching patient's records", () => {
        const error = {message: 'error'};
        const expectedAction = {
            type: ActionConstants.LOAD_INSTITUTION_PATIENTS_ERROR,
            error
        };
        expect(actions.loadInstitutionPatientsError(error)).toEqual(expectedAction)
    });
});

const middlewares = [thunk.withExtraArgument(axiosBackend)];
const mockStore = configureMockStore(middlewares);

describe('Record asynchronize actions', function () {
    let store,
        MockApi;
    const institutionKey = 92979802112,
        error = {
            "message" : "An error has occurred.",
            "requestUri": "/rest/institutions/xxx"
        };

    beforeEach(() => {
        MockApi = new MockAdapter(axiosBackend);
        store = mockStore();
    });

    it("creates LOAD_INSTITUTION_PATIENTS_SUCCESS action when loading patient's records successfully is done", function (done) {
        const expectedActions = [
            { type: ActionConstants.LOAD_INSTITUTION_PATIENTS_PENDING},
            { type: ActionConstants.LOAD_INSTITUTION_PATIENTS_SUCCESS, patients}
        ];

        MockApi.onGet(`rest/records?institution=${institutionKey}`).reply(200, patients);

        store.dispatch(actions.loadInstitutionPatients(institutionKey));

        setTimeout(() => {
            expect(store.getActions()).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });

    it("creates LOAD_INSTITUTION_PATIENTS_ERROR action if an error occurred during loading patient's records", function (done) {
        const expectedActions = [
            { type: ActionConstants.LOAD_INSTITUTION_PATIENTS_PENDING},
            { type: ActionConstants.LOAD_INSTITUTION_PATIENTS_ERROR, error}
        ];

        MockApi.onGet(`rest/records?institution=${institutionKey}`).reply(400, error);

        store.dispatch(actions.loadInstitutionPatients(institutionKey));

        setTimeout(() => {
            expect(store.getActions()).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });
});