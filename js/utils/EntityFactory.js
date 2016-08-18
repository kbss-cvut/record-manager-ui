'use strict';

var Utils = require('./Utils');

module.exports = {

    initNewUser: function () {
        return {
            firstName: '',
            lastName: '',
            username: '',
            emailAddress: '',
            password: Utils.generatePassword(),
            isAdmin: false,
            isNew: true
        };
    },

    initNewClinic: function () {
        return {
            name: '',
            emailAddress: '',
            isNew: true
        }
    }
};
