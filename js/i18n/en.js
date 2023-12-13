/**
 * English localization.
 */

import * as Constants from "../constants/DefaultConstants";

export default {
    'locale': 'en',

    'messages': {
        'add': 'Add',
        'back': 'Go Back',
        'cancel': 'Cancel',
        'open': 'Open',
        'close': 'Close',
        'cancel-tooltip': 'Discard changes',
        'save': 'Save',
        'save-and-send-email': 'Save and send email',
        'saving': 'Saving...',
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
        'required': 'Fields marked with * are required',
        'reject': 'Reject',
        'complete': 'Complete',
        'publish': 'Publish',
        'export': 'Export',

        'login.title': Constants.APP_NAME + ' - Login',
        'login.username': 'Username',
        'login.password': 'Password',
        'login.submit': 'Login',
        'login.register': 'Register',
        'login.error': 'Authentication failed.',
        'login.progress-mask': 'Logging in...',
        'login.forgot-password': 'Forgot password?',
        'login.email': 'Email',
        'login.reset-password': 'Reset password',
        'login.forgot-your-password': 'Forgot your password?',
        'login.back-to-login': 'Back to login',
        'login.reset-password-success': 'Link to reset password was sent to the provided email.',
        'login.reset-password-error': 'Resetting password failed. Please contact an administrator if the provided email is correct.',
        'login.token-password-success': 'Your password has been set.',

        'main.users-nav': 'Users',
        'main.institutions-nav': 'Institutions',
        'main.institution-nav': 'My institution',
        'main.records-nav': 'Records',
        'main.logout': 'Logout',
        'main.my-profile': 'My profile',
        'main.history': 'History',
        'main.impersonating': 'Impersonating',

        'dashboard.welcome': 'Hello {name}, Welcome to ' + Constants.APP_NAME + '.',
        'dashboard.create-tile': 'Create record',
        'dashboard.user-tile': 'View my profile',
        'dashboard.users-tile': 'View users',
        'dashboard.institution-tile': 'View my institution',
        'dashboard.institutions-tile': 'View institutions',
        'dashboard.records-tile': 'View records',
        'dashboard.statistics-tile': 'View statistics',

        'notfound.title': 'Not found',
        'notfound.msg-with-id': '{resource} with id {identifier} not found.',
        'notfound.msg': '{resource} not found.',

        'users.panel-title': 'Users',
        'users.create-user': 'Create user',
        'users.email': 'Email',
        'users.open-tooltip': 'View and edit details of this user',
        'users.delete-tooltip': 'Delete this user',
        'users.add-new-user': 'Add new user',
        'users.back-to-institution': 'Back to institution',
        'users.not-found': 'No users were found...',
        'users.loading-error': 'Unable to load users. {error}',

        'delete.dialog-title': 'Delete item?',
        'delete.dialog-content': 'Are you sure you want to remove {itemLabel}?',

        'user.panel-title': 'User',
        'user.first-name': 'First name',
        'user.last-name': 'Last name',
        'user.username': 'Username',
        'user.password': 'Password',
        'user.password-confirm': 'Confirm password',
        'user.passwords-not-matching-tooltip': 'Passwords don\'t match',
        'user.role': 'Role',
        'user.save-success': 'User saved successfully',
        'user.save-success-with-email': 'User saved successfully and informed by email.',
        'user.save-error': 'Unable to save user. {error}',
        'user.delete-success': 'User deleted successfully',
        'user.delete-error': 'Unable to delete user. {error}',
        'user.load-error': 'Unable to load user. {error}',
        'user.password-change': 'Change password',
        'user.password-current': 'Current password',
        'user.password-new': 'New password',
        'user.password-change-success': 'Password changed successfully',
        'user.password-change-success-with-email': 'Password changed successfully and user was informed by email.',
        'user.password-change-error': 'Unable to change password. {error}',
        'user.password-non-valid': 'New password and confirm password must match and be at least 4 characters long.',
        'user.send-invitation-success': 'User invited to study successfully',
        'user.send-invitation-error': 'Unable to invite user to study. {error}',
        'user.invite-to-study-text': 'User has not yet been invited to study. ',
        'user.invite-to-study': 'Send an invitation now',
        'user.delete-invitation-option': 'Delete invitation option',
        'user.delete-invitation-option-success': 'Option to invite user to study has been deleted.',
        'user.delete-invitation-option-error': 'Unable to delete option to invite user to study. {error}',
        'user.impersonate': 'Impersonate',
        'user.impersonate-error': 'Unable to impersonate. {error}',
        'user.edit': 'Edit user profile',

        'institutions.panel-title': 'Institutions',
        'institutions.create-institution': 'Create institution',
        'institutions.open-tooltip': 'View and edit details of this institution',
        'institutions.delete-tooltip': 'Delete this institution',
        'institutions.not-found': 'No institutions were found...',
        'institutions.loading-error': 'Unable to load institutions. {error}',

        'institution.panel-title': 'Institution',
        'institution.name': 'Institution name',
        'institution.email': 'Contact email',
        'institution.created': 'Institution registered on {date}',
        'institution.members.panel-title': 'Institution\'s members',
        'institution.patients.panel-title': 'Institution\'s records',
        'institution.save-success': 'Institution successfully saved.',
        'institution.save-error': 'Unable to save institution. {error}',
        'institution.delete-success': 'Institution deleted successfully',
        'institution.delete-error': 'Unable to delete institution. {error}',
        'institution.load-error': 'Unable to load institution. {error}',
        'institution.members.not-found': 'No institution\'s members were found...',
        'institution.members.loading-error': 'Unable to load institution\'s members. {error}',

        'records.panel-title': 'Records',
        'records.id': 'Id',
        'records.form-template': 'Template',
        'records.local-name': 'Name',
        'records.completion-status': 'Status',
        'records.completion-status-tooltip.complete': 'All required fields of the record have been filled out.',
        'records.completion-status-tooltip.incomplete': 'Some of the required fields of the record have not yet been filled out.',
        'records.completion-status-tooltip.rejected': 'The form was rejected',
        'records.completion-status-tooltip.published': 'The form has been published',
        'records.last-modified': 'Last modified',
        'records.open-tooltip': 'View and edit the record',
        'records.delete-tooltip': 'Delete this record',
        'records.not-found': 'No records were found...',
        'records.loading-error': 'Unable to load records. {error}',
        'records.create-tile': 'Create',
        'records.opened-study.create-tooltip': 'Create new record',
        'records.closed-study.create-tooltip': 'Study is closed for addition of patient records. Please, contact a study coordinator in case you need to add new patient record.',

        'record.panel-title': 'Form {identifier}',
        'record.form-title': 'Details',
        'record.institution': 'Form created at',
        'record.created-by-msg': 'Created {date} by {name}.',
        'record.last-edited-msg': 'Last modified {date} by {name}.',
        'record.save-success': 'Form successfully saved.',
        'record.save-error': 'Unable to save record. {error}',
        'record.form.please-wait': 'Loading form, please wait...',
        'record.delete-success': 'Form deleted successfully',
        'record.delete-error': 'Unable to delete record. {error}',
        'record.load-error': 'Unable to load record. {error}',
        'record.load-form-error': 'Unable to form. {error}',

        'help.local-name': 'Purpose of this entry is your local identifier of record.',

        'wizard.previous': 'Back',
        'wizard.next': 'Next',
        'wizard.finish': 'Finish',

        'history.action-type': 'Action type',
        'history.author': 'Author',
        'history.action': 'Action',
        'history.reset': 'Reset',
        'history.previous': 'Previous',
        'history.next': 'Next',
        'history.time': 'Time',
        'history.open-tooltip': 'View details of this action',
        'history.panel-title': 'Action history',
        'history.load-error': 'Unable to load action. {error}',
        'history.payload': 'Content',
        'history.search': 'Search',
        'history.loading-error': 'Unable to load actions. {error}',
        'history.not-found': 'No actions were found...',
        'history.non-logged': 'Non-logged user',

        'statistics.panel-title': 'Statistics',
        'statistics.number-of-investigators': 'Number of data clerks',
        'statistics.number-of-processed-records': 'Number of processed records',
        'statistics.loading-error': 'Unable to load statistics. {error}',

        'User does not exist.': 'User does not exist.',
        'Provided credentials don\'t match.': 'Provided credentials don\'t match.',
        'Cannot generate Person URI without last name.': 'Cannot generate Person URI without last name.',
        'Cannot generate Person URI due to unsupported encoding.': 'Cannot generate Person URI due to unsupported encoding.',
        'Cannot generate Person URI without first name.': 'Cannot generate Person URI without first name.',
        'The passed institution\'s key is different from the specified one.': 'The passed institution\'s key is different from the specified one.',
        'The passed record\'s key is different from the specified one.': 'The passed record\'s key is different from the specified one.',
        'The passed user\'s current password is different from the specified one.': 'The passed user\'s current password is different from the specified one.',
        'The passed user\'s username is different from the specified one.': 'The passed user\'s username is different from the specified one.',
        'Username cannot contain special characters.': 'Username cannot contain special characters.',
        'Cannot encode an empty password.': 'Cannot encode an empty password.',
        'Unable to fetch remote data.': 'Unable to fetch remote data.',
        'User with patient records cannot be deleted.': 'User with records cannot be deleted.',
        'Cannot update user URI.': 'Cannot update user URI:',
        'The passed username already exists.': 'The passed username already exists.',
        'User with specified username already exists.': 'User with specified username already exists.',
        'Cannot update user.': 'Cannot update user.',
        'Institution with members or patient records cannot be deleted.': 'Institution with members or records cannot be deleted.',
        'Your browser is not fully supported! Some parts of web may not work properly.': 'Your browser is not fully supported! Some parts of web may not work properly.',
        'We recommend using the latest version of ': 'We recommend using the latest version of ',
        'or': ' or',
        'error.record.localNameOfRecordIsNotUnique': 'Name is not unique.',
        'error.record.localNameOfRecordIsEmpty': 'Name is empty.'
    }
};
