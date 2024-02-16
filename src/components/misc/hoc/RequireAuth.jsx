import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import * as Routing from "../../../utils/Routing";
import Routes from "../../../constants/RoutesConstants";

export default function (ComposedComponent) {
    const Authentication = ({authenticated, history, location, match}) => {
        useEffect(() => {
            if (authenticated === false) {
                Routing.transitionTo(Routes.login);
            }
        }, [authenticated]);

        if (!authenticated) {
            return null;
        }

        return <ComposedComponent history={history} location={location} match={match}/>;
    };

    Authentication.propTypes = {
        authenticated: PropTypes.bool,
        location: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
    };

    const mapStateToProps = state => ({
        authenticated: state.auth.authenticated,
    });

    return connect(mapStateToProps)(Authentication);
}
