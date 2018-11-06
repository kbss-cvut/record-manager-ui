'use strict';

import {Configuration, WizardGenerator} from "s-forms";
import Actions from "../../../actions/Actions";
import Ajax from "../../../utils/Ajax";
import FormGenStore from "../../../stores/FormGenStore";
import I18nStore from "../../../stores/I18nStore";
import TypeaheadResultList from "../../typeahead/TypeaheadResultList";
import WizardStore from "../../../stores/WizardStore";
import * as Logger from "../../../utils/Logger";
import {errorLogger} from "../../../utils/HistoryLogger";

const FORM_GEN_URL = 'rest/formGen';

export default class WizardBuilder {

    static generateWizard(record, renderCallback, errorCallback) {
        Ajax.post(FORM_GEN_URL, record).end((data) => {
            Configuration.actions = Actions;
            Configuration.wizardStore = WizardStore;
            Configuration.optionsStore = FormGenStore;
            Configuration.intl = I18nStore.getIntl();
            Configuration.typeaheadResultList = TypeaheadResultList;
            WizardGenerator.createWizard(data, record.question, null, renderCallback);
        }, (error) => {
            errorCallback(error);
            Logger.error('Received no valid wizard.');
        });
    }
};
