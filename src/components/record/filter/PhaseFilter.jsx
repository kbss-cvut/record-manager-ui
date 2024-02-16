import React from "react";
import {Button, Col, Form, Row} from "react-bootstrap";
import {IntelligentTreeSelect} from "intelligent-tree-select";
import {RECORD_PHASE} from "../../../constants/DefaultConstants";
import {useI18n} from "../../../hooks/useI18n";
import {sanitizeArray} from "../../../utils/Utils";

const PhaseFilter = ({value, onChange}) => {
    const {i18n} = useI18n();
    const options = React.useMemo(() => Object.keys(RECORD_PHASE).map(phase => ({
        label: i18n("records.completion-status." + RECORD_PHASE[phase]),
        value: phase
    })), [i18n]);
    const values = sanitizeArray(value);
    const selected = options.filter(o => values.indexOf(o.value) !== -1);
    return <Form className="mt-1">
        <Form.Group as={Row}>
            <Form.Label column={true} xs={4}>{i18n("records.completion-status")}</Form.Label>
            <Col xs={8}>
                <IntelligentTreeSelect options={options} multi={true} renderAsTree={false}
                                       onChange={o => onChange({phase: o.map(o => o.value)}, {})} value={selected}
                                       placeholder={i18n("select.placeholder")} isClearable={false}/>
            </Col>
        </Form.Group>
        <hr/>
        <Row>
            <Col>
                <div className="float-right">
                    <Button size="sm" disabled={values.length === 0} onClick={() => onChange({
                        phase: undefined
                    }, {})}>{i18n("filters.reset")}</Button>
                </div>
            </Col>
        </Row>
    </Form>;
};

export default PhaseFilter;
