import { useI18n } from "../../hooks/useI18n.jsx";
import { canSelectInstitution, hasRole } from "../../utils/RoleUtils.js";
import { ROLE } from "../../constants/DefaultConstants.js";
import HorizontalInput from "../HorizontalInput.jsx";
import React from "react";
import PropTypes from "prop-types";

const InstitutionSelector = ({ currentUser, user, onInstitutionSelected, generateInstitutionsOptions }) => {
  const { i18n } = useI18n();

  return canSelectInstitution(currentUser) ? (
    <HorizontalInput
      type="select"
      name="institution"
      label={`${i18n("institution.panel-title")}*`}
      onChange={onInstitutionSelected}
      value={user?.institution?.name ?? ""}
      labelWidth={3}
      inputWidth={8}
    >
      {generateInstitutionsOptions()}
    </HorizontalInput>
  ) : (
    <HorizontalInput
      type="text"
      name="institution"
      label={`${i18n("institution.panel-title")}*`}
      disabled={true}
      labelWidth={3}
      inputWidth={8}
      value={user?.institution?.name ?? ""}
    ></HorizontalInput>
  );
};

InstitutionSelector.propTypes = {
  currentUser: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  onInstitutionSelected: PropTypes.func.isRequired,
  generateInstitutionsOptions: PropTypes.func.isRequired,
};

export default InstitutionSelector;
