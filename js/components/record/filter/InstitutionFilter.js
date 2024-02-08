import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {loadInstitutions} from "../../../actions/InstitutionsActions";
import {sanitizeArray} from "../../../utils/Utils";
import {useI18n} from "../../../hooks/useI18n";
import {IntelligentTreeSelect} from "intelligent-tree-select";

const InstitutionFilter = ({value, onChange}) => {
    const {i18n} = useI18n();
    const dispatch = useDispatch();
    const institutions = useSelector(state => state.institutions.institutionsLoaded.institutions);
    React.useEffect(() => {
        if (!institutions) {
            dispatch(loadInstitutions());
        }
    }, [dispatch, institutions]);
    const selected = sanitizeArray(institutions).find(o => o.key === value);
    return <IntelligentTreeSelect options={institutions} multi={false} renderAsTree={false} labelKey="name"
                                  valueKey="key"
                                  onChange={o => onChange(o !== null ? o.key : undefined)} value={selected}
                                  placeholder={i18n("select.placeholder")}/>;
};

export default InstitutionFilter;
