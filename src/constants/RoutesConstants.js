const Routes = {
    login: {name: 'login', path: '/login'},
    logout: {name: 'logout', path: '/logout'},
    passwordToken: {name: 'passwordToken', path: '/login/password-reset/:token'},
    passwordReset: {name: 'passwordReset', path: '/login/password-reset'},
    dashboard: {name: 'dashboard', path: '/'},
    users: {name: 'users', path: '/users'},
    createUser: {name: 'createUser', path: '/users/create'},
    editUser: {name: 'editUser', path: '/users/:username'},
    passwordChange: {name: 'passwordChange', path: '/users/:username/password-change'},
    institutions: {name: 'institutions', path: '/institutions'},
    createInstitution: {name: 'createInstitution', path: '/institutions/create'},
    editInstitution: {name: 'editInstitution', path: '/institutions/:key'},
    records: {name: 'records', path: '/records'},
    createRecord: {name: 'createRecord', path: '/records/create'},
    editRecord: {name: 'editRecord', path: '/records/:key'},
    historyActions: {name: 'historyActions', path: '/history'},
    historyAction: {name: 'historyAction', path: '/history/:key'},
    statistics: {name: 'statistics', path: '/statistics'}
};

export default Routes;