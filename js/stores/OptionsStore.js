'use strict';

var Reflux = require('reflux');

var Actions = require('../actions/Actions');
var Ajax = require('../utils/Ajax');

var OptionsStore = Reflux.createStore({

    _options: {},

    init: function() {
        this.listenTo(Actions.loadOptions, this.onLoadOptions);
    },

    onLoadOptions: function(type) {

    }
});

module.exports = OptionsStore;
