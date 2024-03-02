import React, { useEffect, useState } from "react";
import bowser from "bowser";
import { Modal } from "react-bootstrap";

const SUPPORTED_BROWSERS = {
  chrome: ">=87",
  firefox: ">=78",
  safari: ">=14",
  edge: ">=88",
};

export const BrowserCompatibilityModal = () => {
  const [isSupported, setIsSupported] = useState(true);
  useEffect(() => {
    const browser = bowser.getParser(window.navigator.userAgent);
    const supported = browser.satisfies(SUPPORTED_BROWSERS);
    setIsSupported(supported);
  }, []);

  const supportedBrowserList = Object.entries(SUPPORTED_BROWSERS).map(([browserName, minVersion]) => (
    <li key={browserName}>
      {browserName}: {minVersion}
    </li>
  ));

  return (
    <Modal show={!isSupported} backdrop="static" keyboard={false}>
      <Modal.Header>
        <Modal.Title>Browser Compatibility Notice</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Your browser is not fully supported! Some parts of the web may not work properly. We recommend using the
          latest version of Chrome, Firefox, Safari, or Edge.
        </p>
        <p>List of supported browsers:</p>
        <ul>{supportedBrowserList}</ul>
      </Modal.Body>
    </Modal>
  );
};
