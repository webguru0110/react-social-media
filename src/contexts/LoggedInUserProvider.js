import React, { createContext, useContext } from "react";
import { useReducer, useEffect } from "react";
import { loggedInUserReducer, initial } from "../reducers/loggedInUserReducer";
import {
  editUserService,
  followUserService,
  unfollowUserService,
  getUserService,
  addBookmarkService,
  removeBookmarkService,
} from "../services/UserService";
import { useUser } from "./UserProvider";

const LoggedInUserContext = createContext();

export const LoggedInUserProvider = ({ children }) => {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const { userState, dispatch } = useUser();

  const [loggedInUserState, loggedInUserDispatch] = useReducer(
    loggedInUserReducer,
    initial
  );

  const getUser = async (user) => {
    try {
      const response = await getUserService(user);
      if (response.status === 200) {
        loggedInUserDispatch({
          type: "SET_USER",
          payload: { ...response.data.user },
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const editUser = async (userData, token) => {
    try {
      const response = await editUserService(userData, token);
      if (response.status === 201) {
        const updatedUser = response.data.user;
        loggedInUserDispatch({ type: "SET_USER", payload: updatedUser });
        const updatedUsers = userState.allUsers.map((user) =>
          user.username === updatedUser.username ? updatedUser : user
        );
        dispatch({ type: "SET_ALL_USERS", payload: [...updatedUsers] });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const followUser = async (userId, token) => {
    try {
      const response = await followUserService(userId, token);
      if (response.status === 200) {
        const { user, followUser } = response.data;
        const updatedAllUser = userState?.allUsers.map((individualUser) =>
          individualUser.username === user.username
            ? { ...user }
            : individualUser.username === followUser.username
            ? { ...followUser }
            : individualUser
        );

        dispatch({ type: "SET_ALL_USERS", payload: [...updatedAllUser] });
        loggedInUserDispatch({ type: "SET_USER", payload: user });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const unfollowUser = async (userId, token) => {
    try {
      const response = await unfollowUserService(userId, token);
      if (response.status === 200) {
        const { user, followUser } = response.data;

        const updatedAllUser = userState?.allUsers.map((individualUser) =>
          individualUser.username === user.username
            ? { ...user }
            : individualUser.username === followUser.username
            ? { ...followUser }
            : individualUser
        );

        dispatch({ type: "SET_ALL_USERS", payload: [...updatedAllUser] });
        loggedInUserDispatch({ type: "SET_USER", payload: user });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addBookmark = async (postId, token) => {
    try {
      const response = await addBookmarkService(postId, token);
      if (response.status === 200) {
        loggedInUserDispatch({ type: "SET_USER", payload: response.data });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const removeBookmark = async (postId, token) => {
    try {
      const response = await removeBookmarkService(postId, token);
      if (response.status === 200) {
        loggedInUserDispatch({ type: "SET_USER", payload: response.data });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const avatars = [
    {
      url: "https://res.cloudinary.com/darwtgzlk/image/upload/v1687601406/socialMedia/avatar/avatar-1_yg7arg.png",
    },
    {
      url: "https://res.cloudinary.com/darwtgzlk/image/upload/v1687601402/socialMedia/avatar/avatar2_wxqedh.png",
    },
    {
      url: "https://res.cloudinary.com/darwtgzlk/image/upload/v1687601397/socialMedia/avatar/avatar3_gc9xeu.png",
    },
  ];

  useEffect(() => {
    if (token) {
      getUser(username);
    }
  }, [token, username]);

  return (
    <LoggedInUserContext.Provider
      value={{
        loggedInUserState,
        loggedInUserDispatch,
        editUser,
        followUser,
        unfollowUser,
        addBookmark,
        removeBookmark,
        avatars,
      }}
    >
      {children}
    </LoggedInUserContext.Provider>
  );
};

export const useLoggedInUser = () => useContext(LoggedInUserContext);
