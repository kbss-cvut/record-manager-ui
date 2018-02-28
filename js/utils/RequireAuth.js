import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as Routing from "./Routing";
import * as Routes from "./Routes";

export default function(ComposedComponent) {
    class Authentication extends Component {
        componentWillMount() {
            if (!this.props.authenticated) {
                Routing.transitionTo(Routes.login);
            }
        }

        componentWillUpdate(nextProps) {
            if (!nextProps.authenticated) {
                Routing.transitionTo(Routes.login);
            }
        }

        render() {
            return <ComposedComponent {...this.props} />
        }
    }

    function mapStateToProps(state) {
        return { authenticated: state.auth.authenticated };
    }

    return connect(mapStateToProps)(Authentication);
}
