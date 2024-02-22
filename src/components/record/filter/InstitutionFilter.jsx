import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {Button, Col, Form, Row} from "react-bootstrap";
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
    return <Form className="mt-1">
        <Form.Group as={Row} className="mb-0">
            <Form.Label column={true} xs={4}>{i18n("institution.panel-title")}</Form.Label>
            <Col xs={8}>
                <IntelligentTreeSelect options={institutions} multi={false} renderAsTree={false} labelKey="name"
                                       valueKey="key"
                                       onChange={o => onChange({institution: o !== null ? o.key : undefined}, {})}
                                       value={selected}
                                       placeholder={i18n("select.placeholder")} isClearable={false}/>
            </Col>
        </Form.Group>
        <hr/>
        <Row>
            <Col>
                <div className="float-right">
                    <Button size="sm" disabled={value === undefined} onClick={() => onChange({
                        institution: undefined
                    }, {})}>{i18n("filters.reset")}</Button>
                </div>
            </Col>
        </Row>
    </Form>;
};

export default InstitutionFilter;
