import React, { useEffect } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { IntelligentTreeSelect } from "intelligent-tree-select";
import { RECORD_PHASE } from "../../../constants/DefaultConstants";
import { useI18n } from "../../../hooks/useI18n";
import { sanitizeArray } from "../../../utils/Utils";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { loadRecordsPhases } from "../../../actions/RecordsActions.js";

const PhaseFilter = ({ value, onChange }) => {
  const { i18n } = useI18n();

  const phases = useSelector((state) => state.records.recordsPhases.data);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadRecordsPhases());
  }, [dispatch]);

  const options = React.useMemo(() => {
    if (!phases) {
      return [];
    }
    return phases.map((phase) => ({
      label: i18n("records.completion-status." + phase),
      value: phase,
    }));
  }, [phases, i18n]);

  const values = sanitizeArray(value);
  const selected = options.filter((o) => values.indexOf(o.value) !== -1);
  return (
    <Form className="mt-1">
      <Form.Group as={Row}>
        <Form.Label column={true} xs={4}>
          {i18n("records.completion-status")}
        </Form.Label>
        <Col xs={8}>
          <IntelligentTreeSelect
            options={options}
            multi={true}
            renderAsTree={false}
            onChange={(o) => onChange({ phase: o.map((o) => o.value) }, {})}
            value={selected}
            placeholder={i18n("select.placeholder")}
            isClearable={false}
          />
        </Col>
      </Form.Group>
      <hr />
      <Row>
        <Col>
          <div className="float-end">
            <Button
              size="sm"
              disabled={values.length === 0}
              onClick={() =>
                onChange(
                  {
                    phase: undefined,
                  },
                  {},
                )
              }
            >
              {i18n("filters.reset")}
            </Button>
          </div>
        </Col>
      </Row>
    </Form>
  );
};

PhaseFilter.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default PhaseFilter;
