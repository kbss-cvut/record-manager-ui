"use strict";

import * as Utils from "./Utils";
import * as RecordState from "../model/RecordState";
import { RECORD_PHASE } from "../constants/DefaultConstants";

export function initNewUser() {
  return {
    firstName: "",
    lastName: "",
    username: "",
    emailAddress: "",
    password: Utils.generatePassword(),
    roles: [],
    roleGroup: {},
    isNew: true,
  };
}

export function initNewInstitution() {
  return {
    name: "",
    emailAddress: "",
    isNew: true,
  };
}

export function initNewRecord() {
  return {
    localName: "",
    formTemplate: "",
    complete: false,
    isNew: true,
    state: RecordState.createRecordState(),
    phase: RECORD_PHASE.OPEN,
  };
}

export function initNewPassword() {
  return {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };
}
