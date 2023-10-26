import React, {useContext} from "react";
import {useDispatch} from "react-redux";
import {logout} from "../../actions/AuthActions";
import {transitionTo} from "../../utils/Routing";
import Routes from "../../constants/RoutesConstants";
import {isUsingOidcAuth} from "../../utils/OidcUtils";
import {AuthContext} from "../misc/oidc/OidcAuthWrapper";

const Logout = () => {
    const dispatch = useDispatch();
    const authCtx = useContext(AuthContext);
    React.useEffect(() => {
        if (isUsingOidcAuth()) {
            authCtx.logout();
        }
        dispatch(logout()).then(() => {
            transitionTo(Routes.login);
        });
    });

    return null;
}

export default Logout;