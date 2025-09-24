import { isUsingOidcAuth } from "./OidcUtils.js";
import { ROLE } from "../constants/DefaultConstants.js";

export function hasRole(user, ...roles) {
  if (!user?.roles) return false;
  return roles.every((role) => user.roles.includes(role));
}

export function getRoles(user) {
  return user?.roleGroup?.roles;
}

function roleExists(role) {
  return Object.values(ROLE).includes(role);
}

export function hasSupersetOfPrivileges(u1, u2) {
  const u1Roles = getRoles(u1) ?? [];
  const u2Roles = getRoles(u2) ?? [];

  if (u2Roles.length === 0) {
    return u1Roles.length > 0;
  }

  if (u1Roles.length === 0) {
    return false;
  }

  const u1RoleSet = new Set(u1Roles);
  const u2RoleSet = new Set(u2Roles);

  return [...u2RoleSet].every((role) => u1RoleSet.has(role));
}

export function canReadInstitutionPatients(currentUser, institutionKey) {
  return (
    hasRole(currentUser, ROLE.READ_ALL_RECORDS) ||
    (hasRole(currentUser, ROLE.READ_ORGANIZATION_RECORDS) && currentUser.institution?.key === institutionKey)
  );
}

export function canReadInstitutionUsers(currentUser, institutionKey) {
  return (
    hasRole(currentUser, ROLE.READ_ALL_USERS) ||
    (hasRole(currentUser, ROLE.READ_ORGANIZATION_USERS) && currentUser.institution?.key === institutionKey)
  );
}

export function canWriteRecord(currentUser, record) {
  return (
    hasRole(currentUser, ROLE.WRITE_ALL_RECORDS) ||
    (hasRole(currentUser, ROLE.WRITE_ORGANIZATION_RECORDS) && currentUser.institution?.key === record.institution) ||
    currentUser.username === record.author?.username
  );
}

export function canReadRecord(currentUser, record) {
  return (
    hasRole(currentUser, ROLE.READ_ALL_RECORDS) ||
    (hasRole(currentUser, ROLE.READ_ORGANIZATION_RECORDS) && currentUser.institution?.key === record?.institution) ||
    currentUser.username === record?.author?.username
  );
}

export function canWriteUserInfo(currentUser, user) {
  return (
    !isUsingOidcAuth() &&
    (hasRole(currentUser, ROLE.WRITE_ALL_USERS) ||
      (hasRole(currentUser, ROLE.WRITE_ORGANIZATION_USERS) &&
        currentUser.institution?.name === user?.institution?.name) ||
      currentUser.username === user?.username)
  );
}

export function canWriteInstitutionInfo(currentUser, institution) {
  return hasRole(
    currentUser,
    ROLE.WRITE_ALL_ORGANIZATIONS ||
      (hasRole(currentUser, ROLE.WRITE_ORGANIZATION) && currentUser.institution?.name === institution?.name),
  );
}

export function canReadInstitutionInfo(currentUser, institution) {
  return (
    hasRole(currentUser, ROLE.READ_ALL_ORGANIZATIONS) ||
    (hasRole(currentUser, ROLE.READ_ORGANIZATION) && currentUser.institution?.name === institution?.name)
  );
}

export function canSelectInstitution(currentUser) {
  return hasRole(currentUser, ROLE.WRITE_ALL_USERS, ROLE.WRITE_ALL_ORGANIZATIONS);
}
