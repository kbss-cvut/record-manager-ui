'use strict';

var Routes = {
    login: {name: 'login', path: 'login'},
    dashboard: {name: 'dashboard', path: 'dashboard'},
    users: {name: 'users', path: 'users'},
    createUser: {name: 'createUser', path: 'users/create'},
    editUser: {name: 'editUser', path: 'users/:username'},
    clinics: {name: 'clinics', path: 'clinics'},
    createClinic: {name: 'createClinic', path: 'clinics/create'},
    editClinic: {name: 'editClinic', path: 'clinics/:key'},
};

module.exports = Routes;
