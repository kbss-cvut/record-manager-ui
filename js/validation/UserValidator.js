'use strict';

export default class UserValidator {

    static isValid(user) {
        if (!user.firstName || !user.lastName || !user.username || /[^a-zA-Z0-9\-\/]/.test(user.username)) {
            return false;
        }
        return true;
    }
}
