import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getAllPostService,
  likePostService,
  dislikePostService,
  createPostService,
  deletePostService,
  editPostService,
  getCommentsService,
  addCommentsService,
  deleteCommentService,
  editCommentService,
} from "../services/PostService";

const PostsContext = createContext();

export const PostsProvider = ({ children }) => {
  const [allPosts, setAllPosts] = useState([]);

  const [postLoading, setPostLoading] = useState(false);
  const [sortBy, setSortBy] = useState("Latest");

  const getAllPosts = async () => {
    try {
      setPostLoading(true);
      const response = await getAllPostService();
      if (response.status === 200) {
        setPostLoading(false);
        setAllPosts(response.data.posts);
      }
    } catch (error) {
      setPostLoading(false);
      console.error(error);
    } finally {
      setPostLoading(false);
    }
  };

  const likePost = async (postId, token) => {
    try {
      const response = await likePostService(postId, token);
      if (response.status === 201) {
        setPostLoading(false);
        setAllPosts([...response.data.posts]);
      }
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  const dislikePost = async (postId, token) => {
    try {
      const response = await dislikePostService(postId, token);
      if (response.status === 201) {
        setAllPosts([...response.data.posts]);
      }
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  const deletePost = async (postId, token) => {
    try {
      const response = await deletePostService(postId, token);
      if (response.status === 201) {
        setAllPosts([...response.data.posts]);
      }
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  const createPost = async (e, post, token) => {
    try {
      e.preventDefault();
      const response = await createPostService(post, token);
      if (response.status === 201) {
        setAllPosts([...response.data.posts]);
      }
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  const editPost = async (e, postId, post, token) => {
    try {
      e.preventDefault();
      const response = await editPostService(postId, post, token);
      if (response.status === 201) {
        setAllPosts([...response.data.posts]);
      }
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  const getComments = async (postId) => {
    try {
      const response = getCommentsService(postId);
      if (response.status === 200) {
        console.log(response);
      }
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  const addComment = async (postId, commentData, token) => {
    try {
      const response = await addCommentsService(postId, commentData, token);
      if (response.status === 201) {
        setAllPosts(response.data.posts);
      }
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  const deleteComment = async (postId, commentId, token) => {
    try {
      const response = await deleteCommentService(postId, commentId, token);
      if (response.status === 201) {
        setAllPosts(response.data.posts);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const editComment = async (postId, commentId, commentData, token) => {
    try {
      const response = await editCommentService(
        postId,
        commentId,
        commentData,
        token
      );
      if (response.status === 201) {
        setAllPosts(response.data.posts);
      }
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  useEffect(() => {
    getAllPosts();
  }, []);
  return (
    <PostsContext.Provider
      value={{
        setSortBy,
        sortBy,
        allPosts,
        likePost,
        dislikePost,
        createPost,
        deletePost,
        editPost,
        addComment,
        editComment,
        deleteComment,
        getComments,
        postLoading,
      }}
    >
      {children}
    </PostsContext.Provider>
  );
};

export const usePosts = () => useContext(PostsContext);
