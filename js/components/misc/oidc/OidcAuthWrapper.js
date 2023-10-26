import React, {useCallback, useEffect, useState,} from "react";
import {generateRedirectUri, getUserManager} from "../../../utils/OidcUtils";

// Taken from https://github.com/datagov-cz/assembly-line-shared but using a different config processing mechanism

const useThrow = () => {
  const [, setState] = useState();
  return useCallback(
    (error) =>
      setState(() => {
        throw error;
      }),
    [setState]
  );
};

/**
 * Context provider for user data and logout action trigger
 */
export const AuthContext = React.createContext(null);

const OidcAuthWrapper = ({
  children,
  location = window.location,
  history = window.history,
}) => {
  const userManager = getUserManager();
  const throwError = useThrow();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        // Try to get user information
        const user = await userManager.getUser();

        if (user && user.access_token && !user.expired) {
          // User authenticated
          // NOTE: the oidc-client-js library never returns null if the user is not authenticated
          // Checking for existence of BOTH access_token and expired field seems OK
          // Checking only for expired field is not enough
          setUser(user);
        } else {
          // User not authenticated -> trigger auth flow
          await userManager.signinRedirect({
            redirect_uri: generateRedirectUri(location.href),
          });
        }
      } catch (error) {
        throwError(error);
      }
    };
    getUser();
  }, [location, history, throwError, setUser, userManager]);

  useEffect(() => {
    // Refreshing react state when new state is available in e.g. session storage
    const updateUserData = async () => {
      try {
        const user = await userManager.getUser();
        setUser(user);
      } catch (error) {
        throwError(error);
      }
    };

    userManager.events.addUserLoaded(updateUserData);

    // Unsubscribe on component unmount
    return () => userManager.events.removeUserLoaded(updateUserData);
  }, [throwError, setUser, userManager]);

  useEffect(() => {
    // Force log in if session cannot be renewed on background
    const handleSilentRenewError = async () => {
      try {
        await userManager.signinRedirect({
          redirect_uri: generateRedirectUri(location.href),
        });
      } catch (error) {
        throwError(error);
      }
    };

    userManager.events.addSilentRenewError(handleSilentRenewError);

    // Unsubscribe on component unmount
    return () =>
      userManager.events.removeSilentRenewError(handleSilentRenewError);
  }, [location, throwError, setUser, userManager]);

  const logout = useCallback(() => {
    const handleLogout = async () => {
      await userManager.signoutRedirect();
    };
    handleLogout();
  }, [userManager]);

  if (!user) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default OidcAuthWrapper;
