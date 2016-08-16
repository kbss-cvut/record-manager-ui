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

        'login.title': Constants.APP_NAME + ' - Login',
        'login.username': 'Username',
        'login.password': 'Password',
        'login.submit': 'Login',
        'login.register': 'Register',
        'login.error': 'Authentication failed.',
        'login.progress-mask': 'Logging in...',

        'dashboard.welcome': 'Hello {name}, Welcome to ' + Constants.APP_NAME + '.',
        'dashboard.create-tile': 'Create record'
    }
};
