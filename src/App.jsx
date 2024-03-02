import React, { useEffect } from "react";
import {IntlProvider} from "react-intl";
import {Route, Router, Switch} from "react-router-dom";
import MainView from "./components/MainView";
import {connect} from "react-redux";
import {history} from "./utils/Routing";
import {APP_TITLE, BASENAME} from "../config";
import OidcAuthWrapper from "./components/misc/oidc/OidcAuthWrapper";
import OidcSignInCallback from "./components/pages/OidcSignInCallback";
import OidcSilentCallback from "./components/pages/OidcSilentCallback";
import {isUsingOidcAuth} from "./utils/OidcUtils";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./styles/record-manager.css"
import "@kbss-cvut/s-forms/css"
import { BrowserCompatibilityModal } from "./utils/BrowserCompatibilityModal";

const App = (props) => {
    useEffect(() => {
        document.title = APP_TITLE;
    }, [APP_TITLE]);
    
    return <IntlProvider {...props.intl}>
        <Router history={history} basename={BASENAME}>
            <Switch>
                <Route exact={true} path='/oidc-signin-callback' component={OidcSignInCallback}/>
                <Route exact={true} path='/oidc-silent-callback' component={OidcSilentCallback}/>
                <Route path='/' component={isUsingOidcAuth() ? OidcMainView : MainView}/>
            </Switch>
        </Router>
        <BrowserCompatibilityModal />
    </IntlProvider>;
}

const OidcMainView = () => {
    return <OidcAuthWrapper>
        <MainView/>
    </OidcAuthWrapper>;
}

export default connect((state) => {
    return {intl: state.intl}
})(App);
