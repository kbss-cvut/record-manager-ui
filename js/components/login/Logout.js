'use strict';

import React from "react";
import I18nWrapper from "../../i18n/I18nWrapper";
import injectIntl from "../../utils/injectIntl";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {logout} from "../../actions/AuthActions";
import {transitionTo} from "../../utils/Routing";
import {Routes} from "../../utils/Routes";

class Logout extends React.Component {
    componentDidMount() {
        this.props.logout();
        transitionTo(Routes.login);
    }

    render() {
        return null;
    }
}

export default connect(null, mapDispatchToProps)(injectIntl(I18nWrapper(Logout)));

function mapDispatchToProps(dispatch) {
    return {
        logout: bindActionCreators(logout, dispatch)
    }
}