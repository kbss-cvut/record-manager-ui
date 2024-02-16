import React from "react";
import {getUserManager} from "../../utils/OidcUtils";

export default class AuthenticationSilentCallback extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        getUserManager().signinSilentCallback();
    }

    render() {
        return <p/>;
    }
}
