'use strict';

export default class JsonLdUtils {

    static getLocalized(data, intl) {
        const locale = intl.locale;
        const defaultLocale = intl.defaultLocale;
        let defaultValue;

        if (!data) {
            return null;
        }
        if (typeof data !== 'object' && !Array.isArray(data)) {
            return data;
        }
        if (!Array.isArray(data)) {
            return data['@value'];
        }
        for (let i = 0; i < data.length; i++) {
            if (data[i]['@language']) {
                if (data[i]['@language'] === locale) {
                    return data[i]['@value'];
                } else if (data[i]['@language'] === defaultLocale) {
                    defaultValue = data[i]['@value'];
                }
            }
        }
        return defaultValue;
    }
}
