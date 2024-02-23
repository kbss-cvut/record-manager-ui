'use strict';

export function log(msg) {
    console.log(msg);
}

export function warn(msg) {
    if (console.warn) {
        console.warn(msg);
    } else {
        console.log('WARNING: ' + msg);
    }
}

export function error (msg) {
    if (console.error) {
        console.error(msg);
    } else {
        console.log('ERROR: ' + msg);
    }
}


