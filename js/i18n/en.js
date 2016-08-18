/**
 * English localization.
 */

var Constants = require('../constants/Constants');

module.exports = {
    'locale': 'en',

    'messages': {
        'add': 'Add',
        'back': 'Go Back',
        'cancel': 'Cancel',
        'open': 'Open',
        'close': 'Close',
        'cancel-tooltip': 'Discard changes',
        'save': 'Save',
        'delete': 'Delete',
        'headline': 'Headline',
        'name': 'Name',
        'summary': 'Summary',
        'narrative': 'Narrative',
        'table-actions': 'Actions',
        'table-edit': 'Edit',
        'author': 'Author',
        'description': 'Description',
        'select.default': '--- Select ---',
        'yes': 'Yes',
        'no': 'No',
        'unknown': 'Unknown',
        'please-wait': 'Please wait...',
        'actions': 'Actions',

        'login.title': Constants.APP_NAME + ' - Login',
        'login.username': 'Username',
        'login.password': 'Password',
        'login.submit': 'Login',
        'login.register': 'Register',
        'login.error': 'Authentication failed.',
        'login.progress-mask': 'Logging in...',

        'main.dashboard-nav': 'Dashboard',
        'main.users-nav': 'Users',
        'main.clinics-nav': 'Clinics',
        'main.logout': 'Logout',

        'dashboard.welcome': 'Hello {name}, Welcome to ' + Constants.APP_NAME + '.',
        'dashboard.create-tile': 'Create record',
        'dashboard.users-tile': 'View users',
        'dashboard.clinics-tile': 'View clinics',

        'notfound.title': 'Not found',
        'notfound.msg-with-id': '{resource} with id {identifier} not found.',
        'notfound.msg': '{resource} not found.',

        'users.panel-title': 'Users',
        'users.create-user': 'Create user',
        'users.email': 'Email',
        'users.open-tooltip': 'View and edit details of this user',
        'users.delete-tooltip': 'Delete this user',

        'delete.dialog-title': 'Delete item?',
        'delete.dialog-content': 'Are you sure you want to remove {itemLabel}?',

        'user.panel-title': 'User',
        'user.first-name': 'First name',
        'user.last-name': 'Last name',
        'user.username': 'Username',
        'user.password': 'Password',
        'user.password-confirm': 'Confirm password',
        'user.passwords-not-matching-tooltip': 'Passwords don\'t match',
        'user.is-admin': 'Is administrator?',

        'clinics.panel-title': 'Clinics',
        'clinics.create-clinic': 'Create clinic',
        'clinics.open-tooltip': 'View and edit details of this clinic',
        'clinics.delete-tooltip': 'Delete this clinic',

        'clinic.panel-title': 'Clinic',
        'clinic.name': 'Clinic name',
        'clinic.email': 'Contact email',
        'clinic.created': 'Clinic registered on {date}'
    }
};
