"use strict";

export default class UserValidator {
  static isValid(user) {
    return user.firstName && user.lastName && user.username && user.emailAddress;
  }

  static isPasswordValid(password) {
    return password.newPassword && password.confirmPassword;
  }
}
