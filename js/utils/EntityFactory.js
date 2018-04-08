'use strict';

import * as Utils from "./Utils";
import * as RecordState from "../model/RecordState";
import * as Vocabulary from "../constants/Vocabulary";

export function initNewUser() {
    return {
        firstName: '',
        lastName: '',
        username: '',
        emailAddress: '',
        password: Utils.generatePassword(),
        types: [Vocabulary.DOCTOR_TYPE],
        isNew: true
    };
}

export function initNewInstitution() {
    return {
        name: '',
        emailAddress: '',
        isNew: true
    }
}

export function initNewPatientRecord() {
    return {
        localName: '',
        complete: false,
        isNew: true,
        state: RecordState.createInitialState()
    }
}

export function initNewPassword() {
    return {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    }
}
