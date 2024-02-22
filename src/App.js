import React from "react";
import {IntlProvider} from "react-intl";
import {Route, Router, Switch} from "react-router-dom";
import MainView from "./components/MainView";
import {connect} from "react-redux";
import {history} from "./utils/Routing";
import {BASENAME} from "../config";
import OidcAuthWrapper from "./components/misc/oidc/OidcAuthWrapper";
import OidcSignInCallback from "./components/pages/OidcSignInCallback";
import OidcSilentCallback from "./components/pages/OidcSilentCallback";
import {isUsingOidcAuth} from "./utils/OidcUtils";
import "@kbss-cvut/s-forms/css"

const App = (props) => {
    return <IntlProvider {...props.intl}>
        <Router history={history} basename={BASENAME}>
            <Switch>
                <Route exact={true} path='/oidc-signin-callback' component={OidcSignInCallback}/>
                <Route exact={true} path='/oidc-silent-callback' component={OidcSilentCallback}/>
                <Route path='/' component={isUsingOidcAuth() ? OidcMainView : MainView}/>
            </Switch>
        </Router>
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
