import {Routes} from "../utils/Routes";

export const WEB_LANG = 'en';

export const APP_NAME = 'Fertility Saving Study Manager';
export const HOME_ROUTE = Routes.dashboard;

/**
 * Types of message published by the MessageStore
 */
export const MESSAGE_TYPE= {
    SUCCESS: 'success',
    INFO: 'info',
    WARNING: 'warning',
    ERROR: 'danger'
};

/**
 * Duration for which a message is by default displayed by the messaging UI.
 */
export const MESSAGE_DURATION = 5000;

/**
 * Sorting glyph icons
 */
export const SORTING = {
    NO: {glyph: 'sort', title: 'sort.no'},
    ASC: {glyph: 'chevron-up', title: 'sort.asc'},
    DESC: {glyph: 'chevron-down', title: 'sort.desc'}
};

export const UNAUTHORIZED_USER = {name: 'unauthorized'};

export const FILTER_DEFAULT = 'all';

export const DASHBOARDS = {
    MAIN: {
        id: 'main',
            title: 'dashboard.welcome'
    },
    CREATE_REPORT: {
        id: 'createReport',
            title: 'dashboard.create-tile'
    },
    IMPORT_REPORT: {
        id: 'importReport',
            title: 'dashboard.create-import-tile'
    }
};

/**
 * Navigation between dashboards. Key is the current dashboard, value is the target to navigate to on goBack
 */
export const DASHBOARD_GO_BACK = {
    'main': 'main',
    'createReport': 'main',
    'importReport': 'createReport'
};

export const MINUTE = 60 * 1000;   // Minute in milliseconds

// Maximum number of columns supported by Bootstrap
export const COLUMN_COUNT = 12;

// Maximum input value length, for which input of type text should be displayed
export const INPUT_LENGTH_THRESHOLD = 70;

export const PASSWORD_LENGTH = 4;

export const RECORD_REQUIRED_FIELDS = ['localName'];

export const ALERT_TYPES = {
    INFO: 'info',
    SUCCESS: 'success',
    WARNING: 'warning',
    DANGER: 'danger'
};

export const ACTION_FLAG = {
    CREATE_ENTITY: 'CREATE_ENTITY',
    UPDATE_ENTITY: 'UPDATE_ENTITY'
};

export const ACTION_STATUS = {
    PENDING: 'PENDING',
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR'
};

export const ROLE = {
    ADMIN: 'Admin',
    DOCTOR: 'Doctor'
};

export const SEARCH_TYPE = {
  ALL: 'ALL',
  AUTHOR: 'AUTHOR',
  ACTION: 'ACTION'
};

export const PAGINATION_DIRECTION = {
  PREVIOUS: -1,
  NEXT: 1
};

// Number of history actions on one page. Needs to be changes also in back-end
export const ACTIONS_PER_PAGE = 5;

