import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as ActionConstants from "../../../js/constants/ActionConstants";
import MockAdapter from 'axios-mock-adapter';
import {TEST_TIMEOUT} from "../../constants/DefaultTestConstants";
import {axiosBackend} from "../../../js/actions";
import {ROLE} from "../../../js/constants/DefaultConstants";
import {
    loadRecords,
    loadRecordsError,
    loadRecordsPending,
    loadRecordsSuccess
} from "../../../js/actions/RecordsActions";
import {API_URL} from '../../../config';

const records = [{key: 786785600}, {key: 86875960}];

describe('Records synchronize actions', function () {
    it('creates an action to fetch all records', () => {
        const expectedAction = {
            type: ActionConstants.LOAD_RECORDS_PENDING,
        };
        expect(loadRecordsPending()).toEqual(expectedAction)
    });

    it('creates an action to save fetched records', () => {
        const expectedAction = {
            type: ActionConstants.LOAD_RECORDS_SUCCESS,
            records
        };
        expect(loadRecordsSuccess(records)).toEqual(expectedAction)
    });

    it('creates an action about error during fetching records', () => {
        const error = {message: 'error'};
        const expectedAction = {
            type: ActionConstants.LOAD_RECORDS_ERROR,
            error
        };
        expect(loadRecordsError(error)).toEqual(expectedAction)
    });
});

const middlewares = [thunk.withExtraArgument(axiosBackend)];
const mockStore = configureMockStore(middlewares);

describe('Records asynchronize actions', function () {
    let store,
        mockApi;
    const error = {
            "message": "An error has occurred.",
            "requestUri": "/rest/records/xxx"
        },
        doctor = {
            role: ROLE.DOCTOR,
            institution: {
                key: 12345678
            }
        },
        admin = {
            role: ROLE.ADMIN
        },
        institutionKey = 12345678;

    beforeEach(() => {
        mockApi = new MockAdapter(axiosBackend);
        store = mockStore();
    });

    it('creates LOAD_RECORDS_SUCCESS action when loading all records successfully is done', function (done) {
        const expectedActions = [
            {type: ActionConstants.LOAD_RECORDS_PENDING},
            {type: ActionConstants.LOAD_RECORDS_SUCCESS, records}
        ];

        mockApi.onGet(`${API_URL}/rest/records`).reply(200, records);

        store.dispatch(loadRecords(admin));

        setTimeout(() => {
            expect(store.getActions()).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });

    it("creates LOAD_RECORDS_SUCCESS action when loading doctor's institution records is done successfully", function (done) {
        const expectedActions = [
            {type: ActionConstants.LOAD_RECORDS_PENDING},
            {type: ActionConstants.LOAD_RECORDS_SUCCESS, records}
        ];

        mockApi.onGet(`${API_URL}/rest/records?institution=${doctor.institution.key}`).reply(200, records);

        store.dispatch(loadRecords(doctor));

        setTimeout(() => {
            expect(store.getActions()).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });

    it('creates LOAD_RECORDS_SUCCESS action when loading institution records by institution key is done successfully', function (done) {
        const expectedActions = [
            {type: ActionConstants.LOAD_RECORDS_PENDING},
            {type: ActionConstants.LOAD_RECORDS_SUCCESS, records}
        ];

        mockApi.onGet(`${API_URL}/rest/records?institution=${institutionKey}`).reply(200, records);

        store.dispatch(loadRecords(null, institutionKey));

        setTimeout(() => {
            expect(store.getActions()).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });

    it('creates LOAD_RECORDS_ERROR action if an error occurred during loading records', function (done) {
        const expectedActions = [
            {type: ActionConstants.LOAD_RECORDS_PENDING},
            {type: ActionConstants.LOAD_RECORDS_ERROR, error}
        ];

        mockApi.onGet(`${API_URL}/rest/records`).reply(400, error);

        store.dispatch(loadRecords(admin));

        setTimeout(() => {
            expect(store.getActions()).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });
});