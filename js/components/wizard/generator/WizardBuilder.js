'use strict';

import {Configuration, WizardGenerator} from "s-forms";
import {axiosBackend} from "../../../actions/index";
import * as I18nStore from "../../../stores/I18nStore";
import * as Logger from "../../../utils/Logger";
import {API_URL} from '../../../../config';

const FORM_GEN_URL = 'rest/formGen';
const FORM_GEN_POSSIBLE_VALUES_URL = `${API_URL}/rest/formGen/possibleValues`;

export const generateWizard = async (record) => {
    let response;
    try {
        response = await axiosBackend.post(`${API_URL}/${FORM_GEN_URL}`, record);
    } catch (error) {
        Logger.error('Received no valid wizard.');
        throw(error);
    }

    Configuration.intl = I18nStore.getIntl();
    // TODO
    Configuration.i18n = {
        'wizard.next': 'Další',
        'wizard.previous': 'Předchozí'
    };
    Configuration.horizontalWizardNav = true;
    Configuration.modalView = false;
    Configuration.fetchTypeAheadValues = async (query) => {
        const result = await axiosBackend.get(`${FORM_GEN_POSSIBLE_VALUES_URL}?query=${encodeURIComponent(query)}`);
        return result.data;
    }

    // const response = {data: require('../../../form.json')}

    return await WizardGenerator.createWizard(response.data, record.question, null);
};

