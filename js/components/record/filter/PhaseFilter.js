import React from "react";
import {FormControl} from "react-bootstrap";
import {RECORD_PHASE} from "../../../constants/DefaultConstants";
import {useI18n} from "../../../hooks/useI18n";

const PhaseFilter = ({value, onChange}) => {
    const {i18n} = useI18n();
    return <FormControl as='select' value={value || 'no-value'} onChange={e => onChange(e.currentTarget.value)}>
        {[<option key='default' value='no-value' disabled={true}>{i18n("select.default")}</option>]
            .concat(Object.keys(RECORD_PHASE).map(phase =>
                <option
                    key={phase} value={phase}>
                    {i18n("records.completion-status." + RECORD_PHASE[phase])}
                </option>))}
    </FormControl>;
};

export default PhaseFilter;
