"use strict";

import React, { useEffect, useRef, useState } from "react";
import { Alert, Button, Form, Card } from "react-bootstrap";
import HorizontalInput from "../HorizontalInput";
import withI18n from "../../i18n/withI18n";
import { injectIntl } from "react-intl";
import Routes from "../../constants/RoutesConstants";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { ALERT_TYPES } from "../../constants/DefaultConstants";
import AlertMessage from "../AlertMessage";
import { transitionTo } from "../../utils/Routing";
import { login } from "../../actions/AuthActions";
import { LoaderSmall } from "../Loader";
import { deviceIsMobile, deviceIsSupported } from "../../utils/Utils";
import * as SupportedDevices from "../../constants/SupportedDevices";
import PropTypes from "prop-types";

function Login(props) {
  const { i18n } = props;
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [showAlert, setShowAlert] = useState(false);
  const [isDeviceSupported, setIsDeviceSupported] = useState(false);

  const usernameFieldRef = useRef(null);

  useEffect(() => {
    usernameFieldRef.current.focus();
    setIsDeviceSupported(deviceIsSupported());
  }, []);

  const onChange = ({ target }) => {
    if (["username", "password"].includes(target.name)) {
      setCredentials({
        ...credentials,
        [target.name]: target.value,
      });
    }
    setShowAlert(false);
  };

  const onKeyPress = (e) => {
    if (e.key === "Enter") {
      onLogin();
    }
  };

  const onSubmit = () => {
    props.login(credentials.username, credentials.password);
    setShowAlert(true);
  };

  const onForgotPassword = () => {
    transitionTo(Routes.passwordReset);
  };

  const getSupportedBrowsersLinks = () => {
    return SupportedDevices.SUPPORTED_BROWSERS_LINKS.map((browser, index) => {
      return (
        <span key={browser.name}>
          {browser.linkMobile && browser.linkDesktop ? (
            <a
              href={deviceIsMobile() ? browser.linkMobile : browser.linkDesktop}
              target="_blank"
              key="0"
              rel="noreferrer"
            >
              {browser.name}
            </a>
          ) : (
            <span>{browser.name}</span>
          )}
          {index <= SupportedDevices.SUPPORTED_BROWSERS_LINKS.length - 3 && <span>, </span>}
          {index === SupportedDevices.SUPPORTED_BROWSERS_LINKS.length - 2 && <span>{i18n("or")} </span>}
          {index === SupportedDevices.SUPPORTED_BROWSERS_LINKS.length - 1 && <span>.</span>}
        </span>
      );
    });
  };
  return (
    <Card variant="info" className="login-panel">
      <Card.Header className="text-light bg-primary" as="h6">
        {i18n("login.title")}
      </Card.Header>
      <Card.Body>
        {!isDeviceSupported && (
          <div>
            <Alert className={`alert-browser-support`} variant="warning">
              {i18n("Your browser is not fully supported! Some parts of web may not work properly.")}
              <br />
              {i18n("We recommend using the latest version of ")}
              {getSupportedBrowsersLinks()}
            </Alert>
          </div>
        )}
        {showAlert && props.error && (
          <div>
            <AlertMessage type={ALERT_TYPES.DANGER} alertPosition={"top"} message={i18n("login.error")} />
          </div>
        )}
        <Form>
          <HorizontalInput
            type="text"
            name="username"
            ref={usernameFieldRef}
            label={i18n("login.username")}
            value={credentials.username}
            onChange={onChange}
            labelWidth={4}
            onKeyPress={onKeyPress}
            inputWidth={8}
          />
          <HorizontalInput
            type="password"
            name="password"
            label={i18n("login.password")}
            value={credentials.password}
            onChange={onChange}
            labelWidth={4}
            onKeyPress={onKeyPress}
            inputWidth={8}
          />
          <div className="login-forgot-password-block">
            <Button variant="link" className="login-forgot-password" size="sm" onClick={onForgotPassword}>
              {i18n("login.forgot-password")}
            </Button>
          </div>
          <div>
            <Button className="mt-2" variant="success" size="block" onClick={onSubmit} disabled={props.isLogging}>
              {i18n("login.submit")}
              {props.isLogging && <LoaderSmall />}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}

Login.propTypes = {
  login: PropTypes.func,
  error: PropTypes.object,
  isLogging: PropTypes.bool,
  i18n: PropTypes.object.isRequired, // Or whichever type 'i18n' is
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withI18n(Login)));

function mapStateToProps(state) {
  return {
    isLogging: state.auth.isLogging,
    status: state.auth.status,
    error: state.auth.error,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    login: bindActionCreators(login, dispatch),
  };
}
