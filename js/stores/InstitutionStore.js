'use strict';

var Reflux = require('reflux');

var Actions = require('../actions/Actions');
var Ajax = require('../utils/Ajax');
var Utils = require('../utils/Utils');

var InstitutionStore = Reflux.createStore({
    listenables: [Actions],

    _institutions: null,

    onLoadAllInstitutions: function () {
        Ajax.get('rest/institutions').end((data) => {
            this._institutions = data;
            this.trigger({action: Actions.loadAllInstitutions, data: data});
        });
    },

    getInstitutions: function () {
        return this._institutions;
    },

    onLoadInstitution: function (key) {
        Ajax.get('rest/institutions/' + key).end((data) => {
            this.trigger({action: Actions.loadInstitution, data: data});
        });
    },

    onCreateInstitution: function (institution, onSuccess, onError) {
        Ajax.post('rest/institutions').send(institution).end((data, resp) => {
            if (onSuccess) {
                var key = Utils.extractKeyFromLocationHeader(resp);
                onSuccess(key);
            }
            Actions.loadAllInstitutions();
        }, onError);
    },

    onUpdateInstitution: function (institution, onSuccess, onError) {
        Ajax.put('rest/institutions/' + institution.key).send(institution).end(onSuccess, onError);
    },

    onDeleteInstitution: function (institution, onSuccess, onError) {
        Ajax.del('rest/institutions/' + institution.key).end(onSuccess, onError);
    }
});

module.exports = InstitutionStore;
