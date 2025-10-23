import React from "react";
import { injectIntl } from "react-intl";
import withI18n from "../../i18n/withI18n";
import { Button } from "react-bootstrap";
import { LoaderSmall } from "../Loader";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { canReadInstitution, canWriteInstitution } from "../../utils/RoleUtils.js";

const InstitutionRow = (props) => {
  const institution = props.institution;
  const currentUser = useSelector((state) => state.auth.user);

  return (
    <tr>
      <td className="report-row">
        <Button
          variant="link"
          size="sm"
          onClick={() => props.onEdit(props.institution)}
          title={props.i18n("institutions.open-tooltip")}
        >
          {institution.name}
        </Button>
      </td>
      <td className="report-row">{institution.emailAddress}</td>
      <td className="report-row actions">
        {canReadInstitution(currentUser, institution) && (
          <Button
            variant="primary"
            size="sm"
            title={props.i18n("institutions.open-tooltip")}
            onClick={() => props.onEdit(props.institution)}
          >
            {props.i18n("open")}
          </Button>
        )}
        {canWriteInstitution(currentUser, institution) && (
          <Button
            variant="warning"
            size="sm"
            title={props.i18n("institutions.delete-tooltip")}
            onClick={() => props.onDelete(props.institution)}
          >
            {props.i18n("delete")}
            {props.deletionLoading && <LoaderSmall />}
          </Button>
        )}
      </td>
    </tr>
  );
};

InstitutionRow.propTypes = {
  institution: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  deletionLoading: PropTypes.bool.isRequired,
  currentUser: PropTypes.object.isRequired,
  i18n: PropTypes.func.isRequired,
};

export default injectIntl(withI18n(InstitutionRow));
