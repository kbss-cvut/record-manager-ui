'use strict';

import Reflux from 'reflux';
import jsonld from 'jsonld';
import Actions from '../actions/Actions';
import Ajax from '../utils/Ajax';
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
        Ajax.get('rest/formGen/possibleValues?query=' + encodeURIComponent(query)).end(function (data) {
            if (data.length > 0) {
                jsonld.frame(data, {}, null, (err, framed) => {
                    this.options[id] = framed['@graph'];
                    this.trigger(id, this.options[id]);
                });
            } else {
                Logger.warn('No data received when loading options using query' + query + '.');
                this.trigger(id, this.getOptions(id));
            }

        }, () => {
            this.trigger(id, this.getOptions(id));
        });
    };

    getOptions = (id) => {
        return this.options[id] ? this.options[id] : [];
    }
}

export default FormGenStore;
