import React, { createContext, useContext, useState } from "react";

import { loginService, signupService } from "../services/AuthService";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useLoggedInUser } from "./LoggedInUserProvider";
import { useUser } from "./UserProvider";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const [authError, setAuthError] = useState("");
  const [authSignupError, setAuthSignupError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { userState, dispatch } = useUser();
  const { loggedInUserDispatch } = useLoggedInUser();

  const [auth, setAuth] = useState(
    token && username
      ? { isAuth: true, token, username }
      : { isAuth: false, token: "", username: "" }
  );

  const handleSignup = async (e, formValues) => {
    try {
      e.preventDefault();
      if (formValues.password === formValues.confirmPassword) {
        const response = await signupService(formValues);
        if (response.status === 201) {
          const token = response.data.encodedToken;
          const username = response.data.createdUser.username;
          localStorage.setItem("token", token);
          localStorage.setItem("username", username);
          setAuth({
            isAuth: true,
            token,
            username: response.data.createdUser.username,
          });

          dispatch({
            type: "SET_ALL_USERS",
            payload: [...userState.allUsers, { ...response.data.createdUser }],
          });
          loggedInUserDispatch({
            type: "SET_USER",
            payload: { ...response.data.createdUser },
          });
          navigate(location?.state?.from?.pathname || "/");
        }
      } else {
        setAuthSignupError("Password and confirm-password do not match");
      }
    } catch (error) {
      setAuthSignupError(error.response.data.errors[0]);
      console.error(error);
    }
  };

  const handleLogin = async (e, username, password) => {
    try {
      e.preventDefault();
      const response = await loginService(username, password);
      if (response.status === 200) {
        const token = response.data.encodedToken;
        const username = response.data.foundUser.username;
        localStorage.setItem("token", token);
        localStorage.setItem("username", username);
        setAuth({
          isAuth: true,
          token,
          username: response.data.foundUser.username,
        });
        loggedInUserDispatch({
          type: "SET_USER",
          payload: response.data.foundUser,
        });
        navigate(location?.state?.from?.pathname || "/");
      }
    } catch (error) {
      console.error(error);
      setAuthError(error.response.data.errors[0]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    setAuth({ isAuth: false, token: "", username: "", user: {} });
    loggedInUserDispatch({ type: "REMOVE_USER", payload: {} });
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        handleLogin,
        handleLogout,
        handleSignup,
        authError,
        authSignupError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
