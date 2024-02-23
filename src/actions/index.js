import axios from 'axios';
import Routes from "../constants/RoutesConstants";
import {transitionTo} from "../utils/Routing";
import {HttpHeaders} from "../constants/DefaultConstants";
import {getOidcToken} from "../utils/SecurityUtils";
import {isUsingOidcAuth} from "../utils/OidcUtils";

// Axios instance for communicating with Backend
export let axiosBackend = axios.create({
    withCredentials: true
});

axiosBackend.interceptors.request.use((reqConfig) => {
    if (!isUsingOidcAuth()) {
        return reqConfig;
    }
    if (!reqConfig.headers) {
        reqConfig.headers = {};
    }
    reqConfig.headers[HttpHeaders.AUTHORIZATION] = `Bearer ${getOidcToken().access_token}`;
    return reqConfig;
});

axiosBackend.interceptors.response.use(
    response => response,
    error => {
        const {status} = error.response;
        if (status === 401) { // non-logged
            if (!window.location.pathname.includes('/login')) {
                transitionTo(Routes.login);
            }
        }
        if (status === 403) { // non-authorized
            transitionTo(Routes.dashboard);
        }
        /*
        if (status === 500) { // server error
            error = {
                response: {
                    data: {
                        message: "Something went wrong, please try it again or refresh browser."
                    }
                }
            }
        }*/
        return Promise.reject(error);
    }
);

