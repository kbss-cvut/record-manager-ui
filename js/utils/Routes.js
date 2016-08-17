'use strict';

var Routes = {
    login: {name: 'login', path: 'login'},
    dashboard: {name: 'dashboard', path: 'dashboard'},
    users: {name: 'users', path: 'users'},
    createUser: {name: 'createUser', path: 'users/create'},
    editUser: {name: 'editUser', path: 'users/:username'}
};

module.exports = Routes;
