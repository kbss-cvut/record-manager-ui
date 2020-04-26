'use strict';

import {isNil} from 'lodash';

class WizardStore {
    _data = {};
    _stepData = [];

    initWizard = (data, stepData) => {
        this._data = data || {};
        this._stepData = stepData || [];
    };

    updateData = (update) => {
        if (!update) {
            return;
        }

        this._data = {...this._data, ...update};
    };

    updateStepData = (index, update) => {
        if (!update || index < 0 || index >= this._stepData.length) {
            return;
        }

        this._stepData[index] = {...this._stepData[index], ...update};
    };

    /**
     * Inserts the specified step data at the specified index, shifting the existing step data (if present) to the
     * right.
     * @param index Index at which to insert step data
     * @param stepData The data to insert
     */
    insertStep = (index, stepData) => this._stepData.splice(index, 0, stepData ? {...stepData} : {});

    removeStep = (index) => this._stepData.splice(index, 1);

    reset = () => {
        this._data = {};
        this._stepData = [];
    };

    getData = () => this._data;

    getStepData = (index) => isNil(index) ? this._stepData : this._stepData[index];
}

export default WizardStore;
