'use strict';

import Reflux from 'reflux';
import jsonld from 'jsonld';
import axios from 'axios';
import Actions from '../actions/Actions';
import * as Logger from "../utils/Logger";

class FormGenStore extends Reflux.Store {
    constructor() {
        super();
        this.options = {};
        this.listenTo(Actions.loadFormOptions, this.onLoadFormOptions);
    }

    onLoadFormOptions = (id, query) => {
        if (this.options[id] && this.options[id].length !== 0) {
            this.trigger(id, options[id]);
            return;
        }

        axios.get('rest/formGen/possibleValues?query=' + encodeURIComponent(query))
            .then((request) => {
                if (request.data.length > 0) {
                    jsonld.frame(data, {}, null, (err, framed) => {
                        this.options[id] = framed['@graph'];
                        this.trigger(id, this.options[id]);
                    });
                } else {
                    Logger.warn('No data received when loading options using query' + query + '.');
                    this.trigger(id, this.getOptions(id));
                }
            }).catch(() => {
            this.trigger(id, this.getOptions(id));
        });
    };

    getOptions = (id) => {
        return this.options[id] ? this.options[id] : [];
    }
}

export default FormGenStore;
