'use strict';

import Reflux from 'reflux';
import jsonld from 'jsonld';
import Actions from '../actions/Actions';
import * as Logger from "../utils/Logger";
import {axiosBackend} from "../actions";
import {API_URL} from '../../config';

class FormGenStore extends Reflux.Store {
    constructor() {
        super();
        this.options = {};
        this.listenTo(Actions.loadFormOptions, this.onLoadFormOptions);
    }

    onLoadFormOptions = (id, query) => {
        if (this.options[id] && this.options[id].length !== 0) {
            this.trigger(id, this.options[id]);
            return;
        }

        axiosBackend.get(`${API_URL}/rest/formGen/possibleValues?query=${encodeURIComponent(query)}`).then((response) => {
            const data = response.data;
            if (data.length > 0) {
                jsonld.frame(data, {}, null, (err, framed) => {
                    this.options[id] = framed['@graph'];
                    this.trigger(id, this.options[id]);
                });
            } else {
                Logger.warn('No data received when loading options using query' + query + '.');
                this.trigger(id, this.getOptions(id));
            }
        });
    };

    getOptions = (id) => {
        return this.options[id] ? this.options[id] : [];
    }
}

export default FormGenStore;
