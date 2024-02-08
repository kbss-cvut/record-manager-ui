import React from "react";
import {RECORD_PHASE} from "../../../constants/DefaultConstants";
import {useI18n} from "../../../hooks/useI18n";
import {IntelligentTreeSelect} from "intelligent-tree-select";
import {sanitizeArray} from "../../../utils/Utils";

const PhaseFilter = ({value, onChange}) => {
    const {i18n} = useI18n();
    const options = React.useMemo(() => Object.keys(RECORD_PHASE).map(phase => ({
        label: i18n("records.completion-status." + RECORD_PHASE[phase]),
        value: phase
    })), [i18n]);
    const values = sanitizeArray(value);
    const selected = options.filter(o => values.indexOf(o.value) !== -1);
    return <IntelligentTreeSelect options={options} multi={true} renderAsTree={false}
                                  onChange={o => onChange(o.map(o => o.value))} value={selected}
                                  placeholder={i18n("select.placeholder")}/>
};

export default PhaseFilter;
