'use strict';

const Utils = require('./Utils');
const RecordState = require('../model/RecordState');

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
    },

    initNewPatientRecord: function () {
        return {
            localName: '',
            complete: false,
            isNew: true,
            state: RecordState.createInitialState()
        }
    }
};
