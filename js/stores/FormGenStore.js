'use strict';

import jsonld from 'jsonld';
import * as Logger from "../utils/Logger";
import {axiosBackend} from "../actions";
import {API_URL} from '../../config';

const FORM_GEN_POSSIBLE_VALUES_URL = `${API_URL}/rest/formGen/possibleValues`;

class FormGenStore {
    options = {};

    loadFormOptions = async (id, query) => {
        const option = this.options[id];

        if (option && option.length) {
            return this.options[id];
        }

        const {data} = await axiosBackend.get(`${FORM_GEN_POSSIBLE_VALUES_URL}?query=${encodeURIComponent(query)}`);

        if (data.length) {
            const framed = await jsonld.frame(data, {});

            this.options[id] = framed['@graph'];

            return this.options[id];
        }

        Logger.warn(`No data received when loading options using id ${id}`);

        return [];
    }

    getOptions = (id) => this.options[id] || []
}

export default FormGenStore;
