import { getOidcIdentityStorageKey, isUsingOidcAuth } from "./OidcUtils";
import { ROLE } from "../constants/DefaultConstants";

export function getOidcToken() {
  const identityData = sessionStorage.getItem(getOidcIdentityStorageKey());
  return identityData ? JSON.parse(identityData) : {};
}

export function saveOidcToken(token) {
  sessionStorage.setItem(getOidcIdentityStorageKey(), JSON.stringify(token));
}

export function clearToken() {
  sessionStorage.removeItem(getOidcIdentityStorageKey());
}

export function isAdmin(user) {
  return user.roles ? user.roles.includes(ROLE.ADMIN) : false;
}

export function hasRole(user, role) {
  return user.roles ? user.roles.includes(role) : false;
}

export function isImpersonator(user) {
  // When using OIDC, the access token does not contain any info that the current user is being impersonated
  return !isUsingOidcAuth() && user.roles.includes(ROLE.IMPERSONATE);
}

export function getRoles(user) {
  if (!user || !user.roleGroup || !user.roleGroup.roles) {
    return undefined;
  }
  return user.roleGroup.roles;
}

function roleExists(role) {
  return Object.values(ROLE).includes(role);
}
