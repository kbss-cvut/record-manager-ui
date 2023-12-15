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