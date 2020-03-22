'use strict';

import {Configuration, WizardGenerator} from "s-forms";
import axios from 'axios';
import Actions from "../../../actions/Actions";
import FormGenStore from "../../../stores/FormGenStore";
import * as I18nStore from "../../../stores/I18nStore";
import TypeaheadResultList from "../../typeahead/TypeaheadResultList";
import WizardStore from "../../../stores/WizardStore";
import * as Logger from "../../../utils/Logger";

const FORM_GEN_URL = 'rest/formGen';

export const WizardStoreInstance = new WizardStore();

export const generateWizard = (record, renderCallback, errorCallback) => {
    axios.post(FORM_GEN_URL, record).then((response) => {
        Configuration.actions = Actions;
        Configuration.wizardStore = WizardStoreInstance;
        Configuration.optionsStore = new FormGenStore();
        Configuration.intl = I18nStore.getIntl();
        Configuration.typeaheadResultList = TypeaheadResultList;
        WizardGenerator.createWizard(response.data, record.question, null, renderCallback);
    }).catch((error) => {
        errorCallback(error);
        Logger.error('Received no valid wizard.');
    });
};

