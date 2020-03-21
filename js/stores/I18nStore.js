'use strict';

/**
 * Internationalization store for access from non-react components and objects.
 */

let _messages = [];
let _intl = {};

export const setMessages = (messages) => {
    _messages = messages;
};

export const setIntl = (intl) => {
    _intl = intl;
};

export const i18n = (messageId) => {
    return _messages[messageId];
};

export const getIntl = () => {
    return _intl;
};
