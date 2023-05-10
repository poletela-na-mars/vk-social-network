import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../../axios';

// @ts-ignore
export const fetchPosts: any = createAsyncThunk('posts/fetchPosts', async ({mode}) => {
  return axios.get('/posts', { params: { mode: mode } })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.error(err.response.data);
        return Promise.reject(JSON.stringify(err.response.data));
      });
});

// @ts-ignore
export const fetchPost: any = createAsyncThunk('posts/fetchPosts', async ({id}) => {
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
  posts: {
    items: [],
    status: 'loading',
  }
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchPosts.pending]: (state) => {
      state.posts.items = [];
      state.posts.status = 'loading';
    },
    [fetchPosts.fulfilled]: (state, action) => {
      state.posts.items = action.payload;
      state.posts.status = 'loaded';
    },
    [fetchPosts.rejected]: (state) => {
      state.posts.items = [];
      state.posts.status = 'error';
    }
  },
});

export const postsReducer = postsSlice.reducer;
