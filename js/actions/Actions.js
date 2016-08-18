'use strict';

var Reflux = require('reflux');

var Actions = Reflux.createActions([
    'loadAllUsers', 'loadCurrentUser', 'loadUser', 'createUser', 'updateUser', 'deleteUser',

    'loadAllClinics', 'loadClinic', 'createClinic', 'updateClinic', 'deleteClinic',

    'loadOptions'
]);

module.exports = Actions;
