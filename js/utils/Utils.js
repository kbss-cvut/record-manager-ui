'use strict';
import Bowser from 'bowser';
import * as Constants from "../constants/DefaultConstants";
import {HttpHeaders, ROLE} from "../constants/DefaultConstants";
import * as Vocabulary from "../constants/Vocabulary";
import * as supportedDevices from "../constants/SupportedDevices";
import {isAdmin} from "./SecurityUtils";
import parseLinkHeader from "parse-link-header";

/**
 * Common propositions that should not be capitalized
 */
const PREPOSITIONS = [
    'a', 'about', 'across', 'after', 'along', 'among', 'an', 'around', 'as', 'aside', 'at', 'before', 'behind', 'below',
    'beneath', 'beside', 'besides', 'between', 'beyond', 'but', 'by', 'for', 'given', 'in', 'inside', 'into', 'like', 'near',
    'of', 'off', 'on', 'onto', 'outside', 'over', 'since', 'than', 'through', 'to', 'until', 'up', 'via', 'with', 'within',
    'without', 'not'
];

const URL_CONTAINS_QUERY = /^.+\?.+=.+$/;

const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

/**
 * Formats the specified date into DD-MM-YY HH:mm
 * @param date The date to format
 */
export function formatDate(date) {
    const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate().toString();
    const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1).toString();
    const year = (date.getFullYear() % 100).toString();
    const h = date.getHours();
    const hour = h < 10 ? '0' + h : h.toString();
    const minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes().toString();
    return (day + '-' + month + '-' + year + ' ' + hour + ':' + minute);
}

/**
 * Returns a Java constant (uppercase with underscores) as a nicer string.
 *
 * Replaces underscores with spaces. And if capitalize is selected, capitalizes the words.
 */
export function constantToString(constant, capitalize) {
    if (!capitalize) {
        return constant.replace(/_/g, ' ');
    }
    let words = constant.split('_');
    for (let i = 0, len = words.length; i < len; i++) {
        let word = words[i];
        if (i > 0 && PREPOSITIONS.indexOf(word.toLowerCase()) !== -1) {
            words[i] = word.toLowerCase();
        } else {
            words[i] = word.charAt(0) + word.substring(1).toLowerCase();
        }
    }
    return words.join(' ');
}

/**
 * Converts the specified time value from one time unit to the other.
 *
 * Currently supported units are seconds, minutes and hours. When converting to larger units (e.g. from seconds to
 * minutes), the result is rounded to integer.
 *
 * @param fromUnit Unit to convert from
 * @param toUnit Target unit
 * @param value The value to convert
 * @return {*} Converted value
 */
export function convertTime(fromUnit, toUnit, value) {
    if (fromUnit === toUnit) {
        return value;
    }
    switch (fromUnit) {
        case 'second':
            if (toUnit === 'minute') {
                return Math.round(value / 60);
            } else {
                return Math.round(value / 60 / 60);
            }
        case 'minute':
            if (toUnit === 'second') {
                return 60 * value;
            } else {
                return Math.round(value / 60);
            }
        case 'hour':
            if (toUnit === 'second') {
                return 60 * 60 * value;
            } else {
                return 60 * value;
            }
        default:
            return value;
    }
}

/**
 * Extracts report key from location header in the specified Ajax response.
 * @param response Ajax response
 * @return {string} Report key as string
 */
export function extractKeyFromLocationHeader(response) {
    const location = response.headers['location'];
    if (!location) {
        return '';
    }
    return location.substring(location.lastIndexOf('/') + 1);
}

/**
 * Extracts application path from the current window location.
 *
 * I.e. if the current hash is 'reports?_k=312312', the result will be 'reports'
 * @return {String}
 */
export function getPathFromLocation() {
    const hash = window.location.hash;
    const result = /#[/]?([a-z/0-9]+)\?/.exec(hash);
    return result ? result[1] : '';
}

/**
 * Extracts query parameter value from the specified query string
 * @param queryString String to extracts params from
 * @param paramName Name of the parameter to extract
 * @return extracted parameter value or undefined if the parameter is not present in the query
 */
export function extractQueryParam(queryString, paramName) {
    queryString = decodeURI(queryString); // TODO This is a nasty hack, the problem with encoding seems to be
                                          // somewhere in thunk
    const reqexpMatch = queryString.match(new RegExp(paramName + "=([^&]*)"));
    return reqexpMatch ? reqexpMatch[1] : undefined;
}

/**
 * Generates a random integer value between 0 and 2^30 (approx. max Java integer / 2).
 *
 * The reason the number is Java max integer / 2 is to accommodate possible increments of the result.
 * @return {number}
 */
export function randomInt() {
    const min = 0,
        max = 1073741824;   // Max Java Integer / 2
    return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Maps the specified id to a name based on a matching item.
 *
 * This function assumes that the items have been processed by {@link #jsonLdToTypeaheadOption), so the id should
 * be equal to one of the item's 'id' attribute, and if it is, the item's 'name' is returned.
 * @param items The items containing also mapping for the specified value (presumably)
 * @param id The id to map, probably a URI
 * @return {*}
 */
export function idToName(items, id) {
    if (!items) {
        return id;
    }
    for (let i = 0, len = items.length; i < len; i++) {
        if (items[i].id === id) {
            return items[i].name;
        }
    }
    return id;
}

/**
 * Gets the last path fragment from the specified URL.
 *
 * I.e. it returns the portion after the last '/'
 * @param url
 * @return {string|*}
 */
export function getLastPathFragment(url) {
    return url.substring(url.lastIndexOf('/') + 1);
}

/**
 * Calculates a simple hash of the specified string, much like usual Java implementations.
 * @param str The string to compute has for
 * @return {number}
 */
export function getStringHash(str) {
    let hash = 0,
        strlen = str ? str.length : 0,
        i,
        c;
    if (strlen === 0) {
        return hash;
    }
    for (i = 0; i < strlen; i++) {
        c = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + c;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

/**
 * Appends parameters in the specified argument as query parameters to the specified url.
 *
 * The url can already contain a query string
 * @param url The URL to append parameters to
 * @param parameters The parameters to add
 * @return {*} Updated URL
 */
export function addParametersToUrl(url, parameters) {
    if (parameters) {
        url += URL_CONTAINS_QUERY.test(url) ? '&' : '?';
        Object.getOwnPropertyNames(parameters).forEach(function (param) {
            url += param + '=' + parameters[param] + '&';   // '&' at the end of request URI should not be a problem
        });
    }
    return url;
}

export function generatePassword() {
    let pass = '';
    for (let i = 0; i < Constants.PASSWORD_LENGTH; i++) {
        pass += CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length));
    }
    return pass;
}

/**
 * Checks whether the currently logged in user can view patient records of the specified institutions.
 *
 * To be able to view the records, the user has to be an admin or a member of the institution.
 * @param institutionKey Key of the institution to test
 * @return {*|boolean}
 */
export function canLoadInstitutionsPatients(institutionKey, currentUser) {
    return currentUser != null && (isAdmin(currentUser) || (currentUser.institution != null && currentUser.institution.key === institutionKey));
}

export function deviceIsMobile() {
    const winWidth = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth);
    return (winWidth > 0 && winWidth < 321)
        ? true
        : (/Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini|Mobile|MeeGo/i.test(
            navigator.userAgent || navigator.vendor || window.opera));
}

export function getRole(user) {
    const userToTest = user;
    if (!userToTest) {
        return undefined;
    }
    if (userToTest.types) {
        if (userToTest.types.indexOf(Vocabulary.ADMIN_TYPE) !== -1) {
            return ROLE.ADMIN;
        } else {
            return ROLE.DOCTOR;
        }
    }
    return undefined;
}

export function processInstitutions(institutions) {
    return institutions.map((item) => {
        return {label: item.name, value: item.uri}
    });
}

export function validateEmail(email) {
    return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(email);
}

export function deviceIsSupported() {
    const browser = Bowser.getParser(window.navigator.userAgent);

    return browser.satisfies(supportedDevices.SUPPORTED_BROWSERS);
}

// format to DD-MM-YYYY HH:mm:ss:SSS
export function formatDateWithMilliseconds(timestamp) {
    const date = new Date(timestamp);
    return ("00" + date.getDate()).slice(-2) + "-" +
        ("00" + (date.getMonth() + 1)).slice(-2) + "-" +
        date.getFullYear() + " " +
        ("00" + date.getHours()).slice(-2) + ":" +
        ("00" + date.getMinutes()).slice(-2) + ":" +
        ("00" + date.getSeconds()).slice(-2) + ("00" + date.getMilliseconds()).slice(-2);
}

export function sanitizeArray(arr) {
    return arr ? (Array.isArray(arr) ? arr : [arr]) : [];
}

/**
 * Ensures that file download using Ajax triggers browser file save mechanism.
 *
 * Adapted from https://github.com/kennethjiang/js-file-download/blob/master/file-download.js
 * @param data The downloaded data
 * @param filename Name of the file
 * @param mimeType Type of data
 */
export function fileDownload(data, filename, mimeType = "application/octet-stream") {
    const blob = new Blob([data], {type: mimeType});
    const blobURL = window.URL.createObjectURL(blob);
    const tempLink = document.createElement("a");
    tempLink.style.display = "none";
    tempLink.href = blobURL;
    tempLink.setAttribute("download", filename);

    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
    window.URL.revokeObjectURL(blobURL);
}

/**
 * Serializes an object containing parameter data into a URL query string.
 * @param paramData Parameters to serialize
 * @returns {string|string}
 */
export function paramsSerializer(paramData) {
    const keys = Object.keys(paramData);
    let options = "";

    keys.forEach((key) => {
        const isParamTypeObject = typeof paramData[key] === "object";
        const isParamTypeArray = isParamTypeObject && paramData[key].length >= 0;
        if (paramData[key] === undefined || paramData[key] === null) {
            return;
        }

        if (!isParamTypeObject) {
            options += `${key}=${encodeURIComponent(paramData[key])}&`;
        }

        if (isParamTypeObject && isParamTypeArray) {
            paramData[key].forEach((element) => {
                options += `${key}=${encodeURIComponent(element)}&`;
            });
        }
    });

    return options ? options.slice(0, -1) : options;
}

/**
 * Extracts the number of the last page as provided by the 'last' rel HATEOAS link.
 * @param response HTTP response
 * @returns {number|undefined} Page number or undefined, if it could not have been extracted
 */
export function extractLastPageNumber(response) {
    const linkHeader = response.headers[HttpHeaders.LINK];
    if (!linkHeader) {
        return undefined;
    }
    const links = parseLinkHeader(linkHeader);
    return links.last ? Number(links.last.page) : undefined;
}

export function sortToParams(sort) {
    return Object.keys(sort).filter(k => sort[k] !== undefined).map(k => `${sort[k]}${k}`);
}
