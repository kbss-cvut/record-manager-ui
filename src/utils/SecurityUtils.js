import {getOidcIdentityStorageKey, isUsingOidcAuth} from "./OidcUtils";
import {sanitizeArray} from "./Utils";
import {IMPERSONATOR_TYPE} from "../constants/Vocabulary";
import {ROLE} from "../constants/DefaultConstants";

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
    return currentUser.role === ROLE.ADMIN;
}

export function isImpersonator(currentUser) {
    // When using OIDC, the access token does not contain any info that the current user is being impersonated
    return !isUsingOidcAuth() && sanitizeArray(currentUser.types).indexOf(IMPERSONATOR_TYPE) !== -1;
}
