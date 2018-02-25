import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from "../../js/actions";
import * as ActionConstants from "../../js/constants/ActionConstants";
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const MockApi = new MockAdapter(axios);
const middlewares = [thunk.withExtraArgument(axios)];
const mockStore = configureMockStore(middlewares);
const store = mockStore();

describe('Testing User asynchronize actions', function () {
    it('creates SAVE_USER_COMPLETE action when fetching saving user is done', function (done) {
        const expectedActions = [
            { type: ActionConstants.SAVE_USER_BEGIN, actionType: 'CREATE_USER' },
            { type: ActionConstants.SAVE_USER_COMPLETE, actionType: 'CREATE_USER', user: {username: 'test'}},
            { type: ActionConstants.LOAD_USERS_BEGIN},
            { type: ActionConstants.LOAD_USERS_COMPLETE, users: [{}]},
        ];

        const user = {username: 'test'};

        MockApi.onPost('rest/users').reply(200);
        MockApi.onGet('rest/users').reply(200, [{}]);

        store.dispatch(actions.createUser(user));

        setTimeout(() => {
            expect(store.getActions()).toEqual(expectedActions);
            done();
        }, 300);
    });
});