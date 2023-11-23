import {getOidcIdentityStorageKey} from "./OidcUtils";

export function getOidcToken() {
    const identityData = sessionStorage.getItem(getOidcIdentityStorageKey());
    const identity = identityData ? JSON.parse(identityData) : null;
    return `${identity?.token_type} ${identity?.access_token}`;
}

export function saveOidcToken(token) {
    sessionStorage.setItem(getOidcIdentityStorageKey(), JSON.stringify(token));
}

export function clearToken() {
    sessionStorage.removeItem(getOidcIdentityStorageKey());
}
