'use strict';

import Reflux from 'reflux';

class WizardStore extends Reflux.Store {
    constructor() {
        super();

        this._data = {};
        this._stepData = [];
    }

    initWizard = (data, stepData) => {
        this._data = data ? {...data} : {};
        this._stepData = [];
        if (stepData) {
            for (let i = 0, len = stepData.length; i < len; i++) {
                this._stepData.push({...stepData[i]});
            }
        }
    };

    updateData = (update) => {
        if (!update) {
            return;
        }

        this._data = {...this._data, ...update};
        this.trigger();
    };

    updateStepData = (index, update) => {
        if (!update || index < 0 || index >= this._stepData.length) {
            return;
        }

        this._stepData[index] = {...this._stepData[index], ...update};
        this.trigger();
    };

    /**
     * Inserts the specified step data at the specified index, shifting the existing step data (if present) to the
     * right.
     * @param index Index at which to insert step data
     * @param stepData The data to insert
     */
    insertStep = (index, stepData) => {
        this._stepData.splice(index, 0, stepData ? {...stepData} : {});
        this.trigger();
    };

    removeStep = (index) => {
        this._stepData.splice(index, 1);
        this.trigger();
    };

    reset = () => {
        this._data = {};
        this._stepData = [];
    };

    getData = () => {
        return this._data;
    };

    getStepData = (index) => {
        return (index !== undefined && index !== null) ? this._stepData[index] : this._stepData;
    }
}

export default WizardStore;