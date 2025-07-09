import Routes from "./RoutesConstants";
import { APP_TITLE } from "../../config";

import * as Vocabulary from "./Vocabulary.js";
export const WEB_LANG = "en";

export const APP_NAME = APP_TITLE;
export const HOME_ROUTE = Routes.dashboard;

/**
 * Duration for which a message is by default displayed by the messaging UI.
 */
export const MESSAGE_DURATION = 5000;
export const MESSAGE_DISPLAY_COUNT = 5;

/**
 * Sorting glyph icons
 */
export const SORTING = {
  NO: { glyph: "sort", title: "sort.no" },
  ASC: { glyph: "chevron-up", title: "sort.asc" },
  DESC: { glyph: "chevron-down", title: "sort.desc" },
};

export const UNAUTHORIZED_USER = { name: "unauthorized" };

export const FILTER_DEFAULT = "all";

export const DASHBOARDS = {
  MAIN: {
    id: "main",
    title: "dashboard.welcome",
  },
  CREATE_REPORT: {
    id: "createReport",
    title: "dashboard.create-tile",
  },
  IMPORT_REPORT: {
    id: "importReport",
    title: "dashboard.create-import-tile",
  },
};

/**
 * Navigation between dashboards. Key is the current dashboard, value is the target to navigate to on goBack
 */
export const DASHBOARD_GO_BACK = {
  main: "main",
  createReport: "main",
  importReport: "createReport",
};

export const MINUTE = 60 * 1000; // Minute in milliseconds

// Maximum number of columns supported by Bootstrap
export const COLUMN_COUNT = 12;

// Maximum input value length, for which input of type text should be displayed
export const INPUT_LENGTH_THRESHOLD = 70;

export const PASSWORD_LENGTH = 4;

export const RECORD_REQUIRED_FIELDS = [];

export const ALERT_TYPES = {
  INFO: "info",
  SUCCESS: "success",
  WARNING: "warning",
  DANGER: "danger",
};

export const ACTION_FLAG = {
  CREATE_ENTITY: "CREATE_ENTITY",
  UPDATE_ENTITY: "UPDATE_ENTITY",
};

export const FORM_ACTION_FLAG = {
  COMPLETE_FORM: "COMPLETE_FORM",
  REJECT_FORM: "REJECT_FORM",
  SAVE_FORM: "SAVE_FORM",
};

export const ACTION_STATUS = {
  PENDING: "PENDING",
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
};

export const ROLE = {
  // DEPRECATED
  ADMIN: "ROLE_ADMIN",
  // DEPRECATED
  USER: "ROLE_USER",
  COMPLETE_RECORDS: "rm-complete-records",
  REJECT_RECORDS: "rm-reject-records",
  PUBLISH_RECORDS: "rm-publish-records",
  DELETE_ALL_RECORDS: "rm-delete-all-records",
  EDIT_ALL_RECORDS: "rm-edit-all-records",
  VIEW_ALL_RECORDS: "rm-view-all-records",
  DELETE_ORGANIZATION_RECORDS: "rm-delete-organization-records",
  EDIT_ORGANIZATION_RECORDS: "rm-edit-organization-records",
  VIEW_ORGANIZATION_RECORDS: "rm-view-organization-records",
  EDIT_USERS: "rm-edit-users",
  IMPORT_CODELISTS: "rm-import-codelists",
  IMPERSONATE: "rm-impersonate",
};

// Default number of table elements per page.
export const DEFAULT_PAGE_SIZE = 10;

export const SortDirection = {
  ASC: "+",
  DESC: "-",
};

export const STATISTICS_TYPE = {
  NUMBER_OF_INVESTIGATORS: "statistics.number-of-investigators",
  NUMBER_OF_PROCESSED_RECORDS: "statistics.number-of-processed-records",
};

export const SCRIPT_ERROR = "SCRIPT_ERROR";

export const HttpHeaders = {
  AUTHORIZATION: "Authorization",
  CONTENT_DISPOSITION: "content-disposition",
  LINK: "link",
};

export const MediaType = {
  FORM_URLENCODED: "application/x-www-form-urlencoded",
  EXCEL: "application/vnd.ms-excel",
  JSON: "application/json",
};

export const EXTENSION_CONSTANTS = {
  SUPPLIER: "supplier",
  OPERATOR: "operator",
};

export const RECORD_PHASE = {
  OPEN: "open",
  VALID: "valid",
  COMPLETED: "completed",
  PUBLISHED: "published",
  REJECTED: "rejected",
};

export const STORAGE_TABLE_PAGE_SIZE_KEY = `${APP_TITLE}_TABLE_PAGE_SIZE`;
