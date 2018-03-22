'use strict';

export default class UserValidator {

    static isValid(user) {
        if (!user.firstName || !user.lastName || !user.username) {
            return false;
        }
        return true;
    }

    static isPasswordValid(password) {
        if (!password.newPassword || !password.confirmPassword) {
            return false;
        }
        return true;
    }
}
