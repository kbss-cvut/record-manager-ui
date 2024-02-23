'use strict';
import * as Constants from "../constants/DefaultConstants";

export default class RecordValidator {
    static isComplete(record) {
        if (!record) {
            return false;
        }
        for (let i = 0, len = Constants.RECORD_REQUIRED_FIELDS.length; i < len; i++) {
            if (!record[Constants.RECORD_REQUIRED_FIELDS[i]]) {
                return false;
            }
        }
        return true;
    }
}
