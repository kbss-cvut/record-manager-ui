'use strict';

export default class InstitutionValidator {
    static isValid(institution) {
        return !!institution.name;
    }
}
