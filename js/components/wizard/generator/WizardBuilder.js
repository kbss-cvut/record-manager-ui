'use strict';

import {Configuration, WizardGenerator} from "s-forms";
import {axiosBackend} from "../../../actions/index";
import FormGenStore from "../../../stores/FormGenStore";
import * as I18nStore from "../../../stores/I18nStore";
import * as Logger from "../../../utils/Logger";
import {API_URL} from '../../../../config';

const FORM_GEN_URL = 'rest/formGen';

export const generateWizard = async (record, initWizard) => {
    const formGenStore = new FormGenStore()

    let response;
    try {
        response = await axiosBackend.post(`${API_URL}/${FORM_GEN_URL}`, record);
    } catch (error) {
        Logger.error('Received no valid wizard.');
        throw(error);
    }

    Configuration.loadFormOptions = formGenStore.loadFormOptions;
    Configuration.getOptions = formGenStore.getOptions;

    Configuration.initWizard = initWizard;
    Configuration.intl = I18nStore.getIntl();

    // const response = {data: require('../../../form.json')}

    return await WizardGenerator.createWizard(response.data, record.question, null);
};

