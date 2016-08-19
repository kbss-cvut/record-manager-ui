'use strict';

var jsonld = require('jsonld');

var Ajax = require('../../../utils/Ajax');
var Constants = require('../../../constants/Constants');
var FormUtils = require('./FormUtils').default;
var I18nStore = require('../../../stores/I18nStore');
var JsonLdUtils = require('../../../utils/JsonLdUtils').default;
var Logger = require('../../../utils/Logger');
var Utils = require('../../../utils/Utils');
var Vocabulary = require('../../../constants/Vocabulary');
var GeneratedStep = require('./GeneratedStep').default;
var WizardStore = require('../../../stores/WizardStore');

var FORM_GEN_URL = 'rest/formGen';

var WizardGenerator = {

    generateWizard: function (record, renderCallback) {
        Ajax.post(FORM_GEN_URL, record).end(function
            (data) {
            this._createWizard(data, renderCallback);
        }.bind(this), function () {
            Logger.error('Received no valid wizard.');
        }.bind(this));
    },

    _createWizard: function (structure, renderCallback) {
        jsonld.frame(structure, {}, function (err, framed) {
            if (err) {
                Logger.error(err);
            }
            try {
                var wizardProperties = {
                    steps: this._constructWizardSteps(framed),
                };
            } catch (e) {
                Logger.error('Unable to create wizard. Caught error: ' + e);
                return;
            }
            renderCallback(wizardProperties);
        }.bind(this));
    },

    _constructWizardSteps: function (structure) {
        var form = structure['@graph'],
            formElements,
            item,
            steps = [],
            i, len;

        for (i = 0, len = form.length; i < len; i++) {
            item = form[i];
            if (FormUtils.isForm(item)) {
                form = item;
                break;
            }
        }
        formElements = form[Constants.FORM.HAS_SUBQUESTION];
        if (!formElements) {
            Logger.error('Could not find any wizard steps in the received data.');
            throw 'No wizard steps in form';
        }
        for (i = 0, len = formElements.length; i < len; i++) {
            item = formElements[i];
            if (FormUtils.isWizardStep(item) && !FormUtils.isHidden(item)) {
                steps.push({
                    name: JsonLdUtils.getLocalized(item[Vocabulary.RDFS_LABEL], I18nStore.getIntl()),
                    component: GeneratedStep,
                    data: item
                });
            } else {
                Logger.warn('Item is not a wizard step: ' + item);
            }
        }
        // TODO Temporary sorting
        steps.sort(function (a, b) {
            if (a.name < b.name) {
                return 1;
            } else if (a.name > b.name) {
                return -1;
            }
            return 0;
        });
        WizardStore.initWizard({
            root: form
        }, steps.map((item) => {
            return item.data;
        }));
        return steps;
    }
};

module.exports = WizardGenerator;
