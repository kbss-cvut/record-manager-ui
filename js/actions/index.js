import axios from 'axios';
import Routes from "../constants/RoutesConstants";
import {transitionTo} from "../utils/Routing";

// Axios instance for communicating with Backend
export let axiosBackend = axios.create({
    withCredentials: true
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

