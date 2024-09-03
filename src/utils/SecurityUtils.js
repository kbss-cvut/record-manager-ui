import { getOidcIdentityStorageKey, isUsingOidcAuth } from "./OidcUtils";
import { sanitizeArray } from "./Utils";
import { IMPERSONATOR_TYPE } from "../constants/Vocabulary";
import { ROLE, TYPE_ROLE } from "../constants/DefaultConstants";

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

export function isAdmin(currentUser) {
  return currentUser.roles ? currentUser.roles.includes(ROLE.ADMIN) : false;
}

export function hasRole(currentUser, role) {
  return currentUser.roles ? currentUser.roles.includes(role) : false;
}

export function isImpersonator(currentUser) {
  // When using OIDC, the access token does not contain any info that the current user is being impersonated
  return !isUsingOidcAuth() && sanitizeArray(currentUser.types).indexOf(IMPERSONATOR_TYPE) !== -1;
}

export function getRoles(user) {
  if (!user) {
    return undefined;
  }
  let roles = [];
  user.types.map((type) => {
    TYPE_ROLE[type] && roles.push(TYPE_ROLE[type]);
  });
  return roles;
}
