'use strict';

import {Configuration, WizardGenerator} from "s-forms";
import {axiosBackend} from "../../../actions/index";
import FormGenStore from "../../../stores/FormGenStore";
import * as I18nStore from "../../../stores/I18nStore";
import TypeaheadResultList from "../../typeahead/TypeaheadResultList";
import WizardStore from "../../../stores/WizardStore";
import * as Logger from "../../../utils/Logger";
import {API_URL} from '../../../../config';

const FORM_GEN_URL = 'rest/formGen';

export const WizardStoreInstance = new WizardStore();

export const generateWizard = (record, renderCallback, errorCallback) => {
    const formGenStore = new FormGenStore()

    axiosBackend.post(`${API_URL}/${FORM_GEN_URL}`, record).then((response) => {
        Configuration.loadFormOptions = formGenStore.loadFormOptions;
        Configuration.getOptions = formGenStore.getOptions;

        Configuration.wizardStore = WizardStoreInstance;
        Configuration.intl = I18nStore.getIntl();
        Configuration.typeaheadResultList = TypeaheadResultList;
        WizardGenerator.createWizard(response.data, record.question, null, renderCallback);
    }).catch((error) => {
        errorCallback(error);
        Logger.error('Received no valid wizard.');
    });
};

