import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from "../../../js/actions/index";
import * as ActionConstants from "../../../js/constants/ActionConstants";
import MockAdapter from 'axios-mock-adapter';
import {TEST_TIMEOUT} from "../../constants/DefaultTestConstants";
import {axiosBackend} from "../../../js/actions";
import {ACTION_FLAG, ROLE} from "../../../js/constants/DefaultConstants";

const patients = [
    {localName: 'record1'},
    {localName: 'record2'}
];

describe('Record synchronize actions', function () {
    const record = {key: 7979868757},
        key = 7979868757,
        error = {message: 'error'};

    it('creates an action to save record', () => {
        const actionFlag = ACTION_FLAG.CREATE_ENTITY;
        const expectedAction = {
            type: ActionConstants.SAVE_RECORD_PENDING,
            actionFlag
        };
        expect(actions.saveRecordPending(actionFlag)).toEqual(expectedAction)
    });

    it('creates an action to announce successful save of record', () => {
        const actionFlag = ACTION_FLAG.CREATE_ENTITY ;
        const expectedAction = {
            type: ActionConstants.SAVE_RECORD_SUCCESS,
            record,
            key,
            actionFlag
        };
        expect(actions.saveRecordSuccess(record, key, actionFlag)).toEqual(expectedAction)
    });

    it('creates an action to announce unsuccessful save of record', () => {
        const actionFlag = ACTION_FLAG.UPDATE_ENTITY ;
        const expectedAction = {
            type: ActionConstants.SAVE_RECORD_ERROR,
            error,
            record,
            actionFlag,
        };
        expect(actions.saveRecordError(error, record, actionFlag)).toEqual(expectedAction)
    });

    it('creates an action to unload saved record', () => {
        const expectedAction = {
            type: ActionConstants.UNLOAD_SAVED_RECORD
        };
        expect(actions.unloadSavedRecord()).toEqual(expectedAction)
    });

    it('creates an action to delete record', () => {
        const expectedAction = {
            type: ActionConstants.DELETE_RECORD_PENDING,
            key
        };
        expect(actions.deleteRecordPending(key)).toEqual(expectedAction)
    });

    it('creates an action to announce successful delete of record', () => {
        const expectedAction = {
            type: ActionConstants.DELETE_RECORD_SUCCESS,
            record
        };
        expect(actions.deleteRecordSuccess(record)).toEqual(expectedAction)
    });

    it('creates an action to announce unsuccessful delete of record', () => {
        const expectedAction = {
            type: ActionConstants.DELETE_RECORD_ERROR,
            error,
            record
        };
        expect(actions.deleteRecordError(error, record)).toEqual(expectedAction)
    });

    it('creates an action to fetch record', () => {
        const expectedAction = {
            type: ActionConstants.LOAD_RECORD_PENDING,
        };
        expect(actions.loadRecordPending()).toEqual(expectedAction)
    });

    it('creates an action to save fetched record', () => {
        const expectedAction = {
            type: ActionConstants.LOAD_RECORD_SUCCESS,
            record
        };
        expect(actions.loadRecordSuccess(record)).toEqual(expectedAction)
    });

    it('creates an action about error during fetching record', () => {
        const expectedAction = {
            type: ActionConstants.LOAD_RECORD_ERROR,
            error
        };
        expect(actions.loadRecordError(error)).toEqual(expectedAction)
    });

    it('creates an action to unload loaded record', () => {
        const expectedAction = {
            type: ActionConstants.UNLOAD_RECORD,
        };
        expect(actions.unloadRecord()).toEqual(expectedAction)
    });
    
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
        },
        record = {key: 696875909},
        records = [
            {key: 7986787608},
            {key: 8968756596}
        ],
        currentUser = {
            role: ROLE.ADMIN
        },
        key = '696875909',
        location = `rest/records/${key}`;

    beforeEach(() => {
        MockApi = new MockAdapter(axiosBackend);
        store = mockStore();
    });

    it('creates SAVE_RECORD_SUCCESS action when saving record successfully is done', function (done) {
        const expectedActions = [
            { type: ActionConstants.SAVE_RECORD_PENDING, actionFlag: ACTION_FLAG.CREATE_ENTITY },
            { type: ActionConstants.SAVE_RECORD_SUCCESS, key, actionFlag: ACTION_FLAG.CREATE_ENTITY, record},
            { type: ActionConstants.LOAD_RECORDS_PENDING},
            { type: ActionConstants.LOAD_RECORDS_SUCCESS, records},
        ];

        MockApi.onPost('rest/records').reply(200, null, {location});
        MockApi.onGet('rest/records').reply(200, records);

        store.dispatch(actions.createRecord(record, currentUser));

        setTimeout(() => {
            expect(store.getActions()).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });

    it('creates UPDATE_RECORD_SUCCESS action when saving record successfully is done', function (done) {
        const expectedActions = [
            { type: ActionConstants.SAVE_RECORD_PENDING, actionFlag: ACTION_FLAG.UPDATE_ENTITY },
            { type: ActionConstants.SAVE_RECORD_SUCCESS, key: null, actionFlag: ACTION_FLAG.UPDATE_ENTITY, record},
            { type: ActionConstants.LOAD_RECORDS_PENDING},
            { type: ActionConstants.LOAD_RECORDS_SUCCESS, records},
        ];

        MockApi.onPut(`rest/records/${record.key}`).reply(200, null, {location});
        MockApi.onGet('rest/records').reply(200, records);

        store.dispatch(actions.updateRecord(record, currentUser));

        setTimeout(() => {
            expect(store.getActions()).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });

    it('creates SAVE_RECORD_ERROR action if an error occurred during updating record', function (done) {
        const expectedActions = [
            { type: ActionConstants.SAVE_RECORD_PENDING, actionFlag: ACTION_FLAG.UPDATE_ENTITY },
            { type: ActionConstants.SAVE_RECORD_ERROR, actionFlag: ACTION_FLAG.UPDATE_ENTITY, error, record}
        ];

        MockApi.onPut(`rest/records/${record.key}`).reply(400, error);

        store.dispatch(actions.updateRecord(record, currentUser));

        setTimeout(() => {
            expect(store.getActions()).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });

    it('creates DELETE_RECORD_SUCCESS action when deleting record successfully is done', function (done) {
        const expectedActions = [
            { type: ActionConstants.DELETE_RECORD_PENDING, key: record.key},
            { type: ActionConstants.LOAD_RECORDS_PENDING},
            { type: ActionConstants.DELETE_RECORD_SUCCESS, record},
            { type: ActionConstants.LOAD_RECORDS_SUCCESS, records},
        ];

        MockApi.onDelete(`rest/records/${record.key}`).reply(200);
        MockApi.onGet('rest/records').reply(200, records);

        store.dispatch(actions.deleteRecord(record, currentUser));

        setTimeout(() => {
            expect(store.getActions()).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });

    it('creates SAVE_RECORD_ERROR action if an error occurred during updating record', function (done) {
        const expectedActions = [
            { type: ActionConstants.DELETE_RECORD_PENDING, key: record.key},
            { type: ActionConstants.DELETE_RECORD_ERROR, error, record}
        ];

        MockApi.onDelete(`rest/records/${record.key}`).reply(400, error);

        store.dispatch(actions.deleteRecord(record, currentUser));

        setTimeout(() => {
            expect(store.getActions()).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });

    it('creates LOAD_RECORD_SUCCESS action when loading record successfully is done', function (done) {
        const expectedActions = [
            { type: ActionConstants.LOAD_RECORD_PENDING},
            { type: ActionConstants.LOAD_RECORD_SUCCESS, record}
        ];

        MockApi.onGet(`rest/records/${record.key}`).reply(200, {key: record.key});

        store.dispatch(actions.loadRecord(record.key));

        setTimeout(() => {
            expect(store.getActions()).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
    });

    it('creates LOAD_RECORD_ERROR action if an error occurred during loading record', function (done) {
        const expectedActions = [
            { type: ActionConstants.LOAD_RECORD_PENDING},
            { type: ActionConstants.LOAD_RECORD_ERROR, error}
        ];

        MockApi.onGet(`rest/records/${record.key}`).reply(400, error);

        store.dispatch(actions.loadRecord(record.key));

        setTimeout(() => {
            expect(store.getActions()).toEqual(expectedActions);
            done();
        }, TEST_TIMEOUT);
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