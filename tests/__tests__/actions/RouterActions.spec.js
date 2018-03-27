import * as ActionConstants from "../../../js/constants/ActionConstants";
import {setTransitionPayload, setViewHandlers} from "../../../js/actions/RouterActions";

describe('Router synchronize actions', function () {
    const routeName = "user",
        payload = {data: 123456},
        handlers = {onEvent: jasmine.createSpy('onEvent')};

    it('creates an action to set view handlers', () => {
        const expectedAction = {
            type: ActionConstants.SET_VIEW_HANDLERS,
            routeName,
            handlers
        };
        expect(setViewHandlers(routeName, handlers)).toEqual(expectedAction)
    });

    it('creates an action to set transition payload', () => {
        const expectedAction = {
            type: ActionConstants.SET_TRANSITION_PAYLOAD,
            routeName,
            payload
        };
        expect(setTransitionPayload(routeName, payload)).toEqual(expectedAction)
    });
});