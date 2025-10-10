import enLang from "../../src/i18n/en.js";
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
