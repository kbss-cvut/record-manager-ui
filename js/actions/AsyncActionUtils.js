import {publishMessage} from "./MessageActions";
import {errorMessage} from "../model/Message";

export function asyncRequest(type) {
    return {type};
}

export function asyncError(type, error) {
    return {
        type,
        error
    };
}

export function asyncSuccess(type) {
    return {type};
}

export function showServerResponseErrorMessage(error, i18nMessageId) {
    return publishMessage(errorMessage(i18nMessageId, {error: error.response.data.message}))
}