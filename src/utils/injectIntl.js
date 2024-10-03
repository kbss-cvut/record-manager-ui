import { injectIntl } from "react-intl";

/**
 * Our version of react-intl's injectIntl.
 *
 * Decorates the basic instance returned by injectIntl with accessors to the wrapped component or element (needed by
 * tests).
 */
export default function (component, props) {
  if (!props) {
    props = {};
  }
  // Store this only for development purposes
  if (process.env.NODE_ENV !== "production") {
    props.withRef = true;
    const comp = injectIntl(component, props);
    comp.wrappedComponent = comp;
    return comp;
  } else {
    return injectIntl(component, props);
  }
}
