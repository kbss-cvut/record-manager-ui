import React, {useMemo, useState} from 'react';
import PropTypes from "prop-types";
import {isNil} from 'lodash';

const INITIAL_DATA = {};
const INITIAL_STEP_DATA = [];

const WizardContext = React.createContext({});

const WizardContextProvider = ({children, ...props}) => {
    const [data, setData] = useState(INITIAL_DATA);
    const [stepData, setStepData] = useState(INITIAL_STEP_DATA);

    const initWizard = (data, stepData) => {
        setData(data || {});
        setStepData(stepData || []);
    };

    const updateData = (update) => {
        if (!update) return;

        setData({...data, ...update});
    }

    const updateStepData = (index, update) => {
        if (!update || index < 0 || index >= stepData.length) return;

        const newStepData = [...stepData];
        newStepData[index] = {...newStepData[index], ...update};

        setStepData(newStepData);
    }

    const insertStep = (index, update) => {
        const newStepData = [...stepData];

        newStepData.splice(index, 0, update || {});
        setStepData(newStepData);
    }

    const removeStep = (index) => {
        const newStepData = [...stepData];

        newStepData.splice(index, 1);
        setStepData(newStepData);
    }

    const reset = () => {
        setData(INITIAL_DATA);
        setStepData(INITIAL_STEP_DATA);
    };

    const getData = () => {
        return data
    };

    const getStepData = (index) => {
        return isNil(index) ? stepData : stepData[index]
    };

    const values = useMemo(
        () => ({
            initWizard,
            updateData,
            updateStepData,
            insertStep,
            removeStep,
            reset,
            getData,
            getStepData
        }),
        [getData, getStepData, removeStep, insertStep, updateData, updateStepData]
    );

    return (
        <WizardContext.Provider value={values} {...props}>
            {children}
        </WizardContext.Provider>
    );
};

WizardContextProvider.propTypes = {
    children: PropTypes.element.isRequired
};

export {WizardContext, WizardContextProvider};
