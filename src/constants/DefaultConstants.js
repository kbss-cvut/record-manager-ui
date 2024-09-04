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
  ADMIN: "Admin",
  DOCTOR: "Doctor",
  COMPLETE_RECORDS: "rm_complete_records",
  REJECT_RECORDS: "rm_reject_records",
  PUBLISH_RECORDS: "rm_publish_records",
  DELETE_ALL_RECORDS: "rm_delete_all_records",
  EDIT_ALL_RECORDS: "rm_edit_all_records",
  VIEW_ALL_RECORDS: "rm_view_all_records",
  DELETE_ORGANIZATION_RECORDS: "rm_delete_organization_records",
  EDIT_ORGANIZATION_RECORDS: "rm_edit_organization_records",
  VIEW_ORGANIZATION_RECORDS: "rm_view_organization_records",
  EDIT_USERS: "rm_edit_users",
  IMPORT_CODELISTS: "rm_import_codelists",
};

export const TYPE_ROLE = {
  [Vocabulary.ADMIN_TYPE]: ROLE.ADMIN,
  [Vocabulary.DOCTOR_TYPE]: ROLE.DOCTOR,
  [Vocabulary.COMPLETE_RECORDS_TYPE]: ROLE.COMPLETE_RECORDS,
  [Vocabulary.REJECT_RECORDS_TYPE]: ROLE.REJECT_RECORDS,
  [Vocabulary.PUBLISH_RECORDS_TYPE]: ROLE.PUBLISH_RECORDS,
  [Vocabulary.DELETE_ALL_RECORDS_TYPE]: ROLE.DELETE_ALL_RECORDS,
  [Vocabulary.EDIT_ALL_RECORDS_TYPE]: ROLE.EDIT_ALL_RECORDS,
  [Vocabulary.VIEW_ALL_RECORDS_TYPE]: ROLE.VIEW_ALL_RECORDS,
  [Vocabulary.DELETE_ORGANIZATION_RECORDS_TYPE]: ROLE.DELETE_ORGANIZATION_RECORDS,
  [Vocabulary.EDIT_ORGANIZATION_RECORDS_TYPE]: ROLE.EDIT_ORGANIZATION_RECORDS,
  [Vocabulary.VIEW_ORGANIZATION_RECORDS_TYPE]: ROLE.VIEW_ORGANIZATION_RECORDS,
  [Vocabulary.EDIT_USERS_TYPE]: ROLE.EDIT_USERS,
  [Vocabulary.IMPORT_CODELISTS_TYPE]: ROLE.IMPORT_CODELISTS,
};
export const ROLE_TYPE = Object.fromEntries(Object.entries(TYPE_ROLE).map(([key, value]) => [value, key]));

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
