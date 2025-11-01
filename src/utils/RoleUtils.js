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

export function canReadInstitutionRecords(currentUser, institutionKey) {
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
  const hasSameInstitution =
    currentUser.institution !== null && currentUser.institution?.name === user?.institution?.name;
  return (
    (currentUser.username === user?.username ||
      hasRole(currentUser, ROLE.WRITE_ALL_USERS) ||
      (hasSameInstitution && hasRole(currentUser, ROLE.WRITE_ORGANIZATION_USERS))) &&
    hasSupersetOfPrivileges(currentUser, user)
  );
}

export function canCreateUser(currentUser, institution) {
  return (
    hasRole(currentUser, ROLE.WRITE_ALL_USERS) ||
    (hasRole(currentUser, ROLE.WRITE_ORGANIZATION_USERS) && currentUser.institution?.name === institution?.name)
  );
}

export function canWriteInstitution(currentUser, institution) {
  return (
    hasRole(currentUser, ROLE.WRITE_ALL_ORGANIZATIONS) ||
    (hasRole(currentUser, ROLE.WRITE_ORGANIZATION) && currentUser.institution?.name === institution?.name)
  );
}

export function canReadInstitution(currentUser, institution) {
  return (
    hasRole(currentUser, ROLE.READ_ALL_ORGANIZATIONS) ||
    (hasRole(currentUser, ROLE.READ_ORGANIZATION) && currentUser.institution?.name === institution?.name)
  );
}

export function canSelectInstitution(currentUser, user) {
  return (
    hasRole(currentUser, ROLE.READ_ALL_ORGANIZATIONS) &&
    hasRole(currentUser, ROLE.WRITE_ALL_ORGANIZATIONS) &&
    canWriteUserInfo(currentUser, user)
  );
}

export function canImpersonate(currentUser, user) {
  return (
    hasRole(currentUser, ROLE.IMPERSONATE) &&
    hasSupersetOfPrivileges(currentUser, user) &&
    currentUser.username !== user.username
  );
}

export function canCreateInstitution(currentUser) {
  return hasRole(currentUser, ROLE.WRITE_ALL_ORGANIZATIONS);
}
