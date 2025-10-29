import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Col, Form, Row } from "react-bootstrap";
import { loadInstitutions } from "../../../actions/InstitutionsActions";
import { sanitizeArray } from "../../../utils/Utils";
import { useI18n } from "../../../hooks/useI18n";
import { IntelligentTreeSelect } from "intelligent-tree-select";
import PropTypes from "prop-types";

const InstitutionFilter = ({ value, onChange }) => {
  const { i18n } = useI18n();
  const dispatch = useDispatch();
  const institutions = useSelector((state) => state.institutions.institutionsLoaded.institutions);

  useEffect(() => {
    dispatch(loadInstitutions());
  }, [dispatch]);

  const options = React.useMemo(() => {
    if (!institutions) {
      return [];
    }
    return institutions.map((institution) => ({
      label: institution.name,
      value: institution.key,
    }));
  }, [institutions, i18n]);

  const selected = sanitizeArray(institutions)
    .filter((o) => value?.includes(o.key))
    .map((institution) => ({
      label: institution.name,
      value: institution.key,
    }));

  return (
    <Form className="mt-1">
      <Form.Group as={Row} className="mb-0">
        <Form.Label column={true} xs={4}>
          {i18n("institution.panel-title")}
        </Form.Label>
        <Col xs={8}>
          <IntelligentTreeSelect
            options={options}
            multi={true}
            renderAsTree={false}
            value={selected}
            onChange={(selectedOptions) => {
              const keys = selectedOptions ? selectedOptions.map((o) => o.value) : [];
              onChange({ institution: keys }, {});
            }}
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
              disabled={value === undefined}
              onClick={() =>
                onChange(
                  {
                    institution: undefined,
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

InstitutionFilter.propTypes = {
  value: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
};

export default InstitutionFilter;
