'use strict';

var Reflux = require('reflux');

var Actions = require('../actions/Actions');
var Ajax = require('../utils/Ajax');
var Authentication = require('../utils/Authentication');
var UserStore = require('./UserStore');

var RecordStore = Reflux.createStore({
    listenables: [Actions],

    _patients: null,

    onLoadAllRecords: function () {
        var user = UserStore.getCurrentUser(),
            urlSuffix = '';
        if (!user) {
            return;
        }
        if (!Authentication.isAdmin() && user.clinic) {
            urlSuffix = '?clinic=' + user.clinic.key;
        }
        Ajax.get('rest/records' + urlSuffix).end((data) => {
            this._patients = data;
            this.trigger({action: Actions.loadAllRecords, data: data});
        }, () => {
            this._patients = [];
            this.trigger({action: Actions.loadAllRecords, data: data});
        });
    },

    getAllRecords: function () {
        return this._patients;
    }
});

module.exports = RecordStore;
