import React from "react";
import {getUserManager} from "../../utils/OidcUtils";

export default class AuthenticationCallback extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        getUserManager().signinRedirectCallback().then(() => {
            const searchParams = new URLSearchParams(location.search);
            if (!searchParams.has("forward_uri")) {
                throw Error("Missing parameter forward_uri");
            }
            const forwardUri = window.atob(searchParams.get("forward_uri"));
            window.location.replace(forwardUri);
        });
    }

    render() {
        return <p>Redirecting...</p>;
    }
}
