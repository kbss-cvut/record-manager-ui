import HorizontalInput from "./HorizontalInput.jsx";
import { hasSupersetOfPrivileges } from "../utils/RoleUtils.js";
import React, { useMemo } from "react";
import { useI18n } from "../hooks/useI18n.jsx";
import PropTypes from "prop-types";

const RoleGroupsSelector = ({ currentUser, user, onRoleGroupSelected, generateGroupOptions }) => {
  const { i18n } = useI18n();

  const currentUserHasHigherPrivileges = useMemo(() => hasSupersetOfPrivileges(currentUser, user), [user, currentUser]);

  return currentUserHasHigherPrivileges || currentUser.username === user.username || user.isNew ? (
    <HorizontalInput
      type="select"
      name="roleGroup"
      label={`${i18n("user.role-group")}*`}
      labelWidth={3}
      inputWidth={8}
      onChange={onRoleGroupSelected}
      value={user?.roleGroup?.uri ?? ""}
    >
      {generateGroupOptions()}
    </HorizontalInput>
  ) : (
    <HorizontalInput
      type="text"
      name="roleGroup"
      label={`${i18n("user.role-group")}*`}
      disabled={true}
      labelWidth={3}
      inputWidth={8}
      value={user?.roleGroup?.name ?? ""}
    ></HorizontalInput>
  );
};

RoleGroupsSelector.propTypes = {
  currentUser: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  onRoleGroupSelected: PropTypes.func.isRequired,
  generateGroupOptions: PropTypes.func.isRequired,
};

export default RoleGroupsSelector;
