import React from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { IntelligentTreeSelect } from "intelligent-tree-select";
import { useI18n } from "../../../hooks/useI18n";
import { sanitizeArray } from "../../../utils/Utils";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { loadFormTemplates } from "../../../actions/FormTemplatesActions.js";

const TemplateFilter = ({ value, onChange }) => {
  const { i18n } = useI18n();
  const dispatch = useDispatch();
  const formTemplates = useSelector((state) => state.formTemplates.formTemplatesLoaded.formTemplates);
  React.useEffect(() => {
    if (!formTemplates) {
      dispatch(loadFormTemplates());
    }
  }, [dispatch, formTemplates]);
  const values = sanitizeArray(value);

  const getFilterOptions = () => {
    let templatesWithLabelAndValue = [];
    for (const t of formTemplates) {
      templatesWithLabelAndValue.push({
        value: t["@id"],
        label: t["http://www.w3.org/2000/01/rdf-schema#label"][0]["@value"],
        ...t,
      });
    }
    return templatesWithLabelAndValue;
  };

  const options = getFilterOptions();
  const selected = options.filter((o) => values.indexOf(o["@id"]) !== -1);

  return (
    <Form className="mt-1">
      <Form.Group as={Row}>
        <Form.Label column={true} xs={4}>
          {i18n("records.form-template")}
        </Form.Label>
        <Col xs={8}>
          <IntelligentTreeSelect
            options={options}
            multi={true}
            renderAsTree={false}
            onChange={(o) => onChange({ formTemplate: o.map((o) => o["@id"]) }, {})}
            value={selected}
            placeholder={i18n("select.placeholder")}
            isClearable={false}
          />
        </Col>
      </Form.Group>
      <hr />
      <Row>
        <Col>
          <div className="float-right">
            <Button
              size="sm"
              disabled={values.length === 0}
              onClick={() =>
                onChange(
                  {
                    formTemplate: undefined,
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

TemplateFilter.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default TemplateFilter;
