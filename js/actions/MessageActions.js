import {DISMISS_MESSAGE, PUBLISH_MESSAGE} from "../constants/ActionConstants";

export function publishMessage(message) {
    return {
        type: PUBLISH_MESSAGE,
        message,
    };
}

export function dismissMessage(message) {
    return {
        type: DISMISS_MESSAGE,
        message,
    };
}
