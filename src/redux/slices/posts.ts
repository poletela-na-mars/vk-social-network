import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../../axios';

import { PostType } from '../../types/PostType';

// @ts-ignore
export const fetchPosts: any = createAsyncThunk('posts/fetchPosts', async ({mode}) => {
  return axios.get('/posts', {params: {mode: mode}})
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.error(err.response.data);
        return Promise.reject(JSON.stringify(err.response.data));
      });
});

// @ts-ignore
export const likePost: any = createAsyncThunk('posts/likePost', async ({postId, posts}) => {
  return axios.patch(`/posts/${postId}`)
      .then((res) => {
        return posts.map((el: PostType) => (el._id === postId) && res.data);
      })
      .catch((err) => {
        console.error(err.response.data);
        return Promise.reject(JSON.stringify(err.response.data));
      });
});

// @ts-ignore
export const fetchPost: any = createAsyncThunk('posts/fetchPost', async ({id}) => {
  return axios.get(`/posts/${id}`)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.error(err.response.data);
        return Promise.reject(JSON.stringify(err.response.data));
      });
});

const initialState = {
  post: null,
  posts: [],
  postStatus: 'loading',
  postsStatus: 'loading',
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchPosts.pending]: (state) => {
      state.posts = [];
      state.postsStatus = 'loading';
    },
    [fetchPosts.fulfilled]: (state, action) => {
      state.posts = action.payload;
      state.postsStatus = 'loaded';
    },
    [fetchPosts.rejected]: (state) => {
      state.posts = [];
      state.postsStatus = 'error';
    },
    [likePost.fulfilled]: (state, action) => {
      state.posts = action.payload;
      state.postsStatus = 'loaded';
    }
  },
});

export const postsReducer = postsSlice.reducer;
