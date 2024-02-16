import { useCallback } from "react";
import { useIntl } from "react-intl";

/**
 * React Hook providing basic i18n functions.
 */
export function useI18n() {
    const intl = useIntl();
    const i18n = useCallback(
        (msgId) => (intl.messages[msgId]) || "{" + msgId + "}",
        [intl]
);
    const formatMessage = useCallback(
        (msgId, values = {}) =>
            intl.formatMessage({ id: msgId }, values),
        [intl]
    );
    return {
        i18n,
        formatMessage,
        formatDate: intl.formatDate,
        formatTime: intl.formatTime,
        locale: intl.locale,
    };
}
