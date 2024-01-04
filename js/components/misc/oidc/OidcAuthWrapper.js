import React, {useCallback, useEffect, useState,} from "react";
import {generateRedirectUri, getUserManager} from "../../../utils/OidcUtils";
import {getOidcToken} from "../../../utils/SecurityUtils";

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
}) => {
  const userManager = getUserManager();
  const throwError = useThrow();
  const [user, setUser] = useState(null);

  useEffect(() => {
    userManager.getUser().then(u => {
      if (u && u.access_token && !u.expired) {
        // User authenticated
        // NOTE: the oidc-client-js library never returns null if the user is not authenticated
        // Checking for existence of BOTH access_token and expired field seems OK
        // Checking only for expired field is not enough
        setUser(u);
      } else {
        // User not authenticated -> trigger auth flow
        return userManager.signinRedirect({
          redirect_uri: generateRedirectUri(location.href),
        });
      }
    }).catch(error => {
      throwError(error);
    })
  }, [location, throwError, setUser, userManager]);

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
      const user = await userManager.getUser();
      const args = {};
      if (!user.id_token) {
        // Explicitly set id_token_hint when it is missing. It means we are impersonating another user
        args.id_token_hint = getOidcToken().impersonatorIdToken;
      }
      await userManager.signoutRedirect(args);
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
