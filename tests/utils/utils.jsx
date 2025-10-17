import enLang from "../../src/i18n/en.js";
import csLang from "../../src/i18n/cs.js";
import { render } from "@testing-library/react";
import { IntlProvider } from "react-intl";
import React from "react";

export const renderWithIntl = (children) => {
  return render(
    <IntlProvider locale="en" {...enLang}>
      {children}
    </IntlProvider>,
  );
};

let currentTestLocale = "en";

const LANGUAGE_MAP = {
  en: enLang,
  cs: csLang,
};

export const getCurrentLangMessages = () => {
  const langMessages = LANGUAGE_MAP[currentTestLocale];
  if (!langMessages) {
    throw new Error(`No messages found for locale: ${currentTestLocale}`);
  }
  return langMessages.messages || {};
};

export const getMessageByKey = (key) => {
  const messages = getCurrentLangMessages();
  const message = messages[key];
  if (!message) {
    console.warn(`Message key "${key}" not found for locale: ${currentTestLocale}`);
    return key;
  }
  return message;
};
