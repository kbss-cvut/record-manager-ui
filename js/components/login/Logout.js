'use strict';

import React from "react";
import withI18n from "../../i18n/withI18n";
import {injectIntl} from "react-intl";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {logout} from "../../actions/AuthActions";
import {transitionTo} from "../../utils/Routing";
import Routes from "../../constants/RoutesConstants";

class Logout extends React.Component {
    componentDidMount() {
        this.props.logout();
        transitionTo(Routes.login);
    }

    render() {
        return null;
    }
}

export default connect(null, mapDispatchToProps)(injectIntl(withI18n(Logout)));

function mapDispatchToProps(dispatch) {
    return {
        logout: bindActionCreators(logout, dispatch)
    }
}