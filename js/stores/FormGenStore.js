'use strict';

import jsonld from 'jsonld';
import * as Logger from "../utils/Logger";
import {axiosBackend} from "../actions";
import {API_URL} from '../../config';

const FORM_GEN_POSSIBLE_VALUES_URL = `${API_URL}/rest/formGen/possibleValues`;

class FormGenStore {
    options = {};

    loadFormOptions = async (id, query) => async (resolve, reject) => {
        const option = this.options[id];

        if (option && option.length) {
            return resolve(this.options[id]);
        }

        try {
            const response = await axiosBackend.get(`${FORM_GEN_POSSIBLE_VALUES_URL}?query=${encodeURIComponent(query)}`);
            const data = response.data;

            if (data.length) {
                const framed = await jsonld.frame(data, {});

                this.options[id] = framed['@graph'];

                return resolve(this.options[id]);
            }
            Logger.warn(`No data received when loading options using query ${query}`);

            return resolve([]);
        } catch (error) {
            Logger.error(`An error has occurred during loadFormOptions using ${query}.`);

            return reject(error);
        }
    }

    getOptions = (id) => this.options[id] || []
}

export default FormGenStore;
