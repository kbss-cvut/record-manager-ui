'use strict';

var Reflux = require('reflux');

var Actions = Reflux.createActions([
    'loadAllUsers', 'loadCurrentUser', 'loadUser', 'createUser', 'updateUser', 'deleteUser',
    'loadInstitutionMembers',

    'loadAllInstitutions', 'loadInstitution', 'createInstitution', 'updateInstitution', 'deleteInstitution', 'loadInstitutionPatients',

    'loadAllRecords', 'loadRecord', 'createRecord', 'updateRecord', 'deleteRecord',

    'loadFormOptions'
]);

module.exports = Actions;
