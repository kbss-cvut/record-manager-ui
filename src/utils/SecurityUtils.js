import { getOidcIdentityStorageKey, isUsingOidcAuth } from "./OidcUtils";

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

export function isImpersonated(user) {
  // When using OIDC, the access token does not contain any info that the current user is being impersonated
  return !isUsingOidcAuth() && user?.impersonated;
}
