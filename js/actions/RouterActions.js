import * as ActionConstants from "../constants/ActionConstants";

export function setViewHandlers(routeName, handlers) {
    console.log(handlers);
    return {
        type: ActionConstants.SET_VIEW_HANDLERS,
        routeName,
        handlers
    }
}

export function setTransitionPayload(routeName, payload) {
    return {
        type: ActionConstants.SET_TRANSITION_PAYLOAD,
        routeName,
        payload
    }
}