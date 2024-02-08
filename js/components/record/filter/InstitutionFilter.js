import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {loadInstitutions} from "../../../actions/InstitutionsActions";
import {sanitizeArray} from "../../../utils/Utils";
import {FormControl} from "react-bootstrap";
import {useI18n} from "../../../hooks/useI18n";

const InstitutionFilter = ({value, onChange}) => {
    const {i18n} = useI18n();
    const dispatch = useDispatch();
    const institutions = useSelector(state => state.institutions.institutionsLoaded.institutions);
    React.useEffect(() => {
        if (!institutions) {
            dispatch(loadInstitutions());
        }
    }, [dispatch, institutions]);
    return <FormControl as='select' value={value || "no-value"} onChange={e => onChange(e.currentTarget.value)}>
        {[<option key='default' value='no-value' disabled={true}>{i18n("select.default")}</option>]
            .concat(sanitizeArray(institutions).map(inst => <option key={inst.key} value={inst.key}>
                {inst.name}
            </option>))}
    </FormControl>
};

export default InstitutionFilter;
