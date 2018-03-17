import * as ActionConstants from "../constants/ActionConstants";

const initialState = {
    transitionPayload: {},
    viewHandlers: {}
};

export default function (state = initialState, action) {
    switch (action.type) {
        case ActionConstants.SET_TRANSITION_PAYLOAD:
            return {
                ...state,
                transitionPayload: {
                    [action.routeName]: action.payload
                }
            };
        case ActionConstants.SET_VIEW_HANDLERS:
            return {
                ...state,
                viewHandlers: {
                    [action.routeName]: action.handlers
                }
            };
        default:
            return state;
    }
}