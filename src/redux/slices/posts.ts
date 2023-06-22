import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../../axios';

// @ts-ignore
export const fetchPosts: any = createAsyncThunk('posts/fetchPosts', async ({id, mode}) => {
  return axios.get('/posts', {params: {mode: mode, id: id}})
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.error(err.response.data);
        return Promise.reject(JSON.stringify(err.response.data));
      });
});

// @ts-ignore
export const postPost: any = createAsyncThunk('posts/postPost', async ({values}) => {
  return axios.post(`/posts`, values)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.error(err.response.data);
        return Promise.reject(JSON.stringify(err.response.data));
      });
});

// TODO - [WORK] - may be useful for infinity scroll (Post)
// // @ts-ignore
// export const fetchPost: any = createAsyncThunk('posts/fetchPost', async ({id}) => {
//   return axios.get(`/posts/${id}`)
//       .then((res) => {
//         return res.data;
//       })
//       .catch((err) => {
//         console.error(err.response.data);
//         return Promise.reject(JSON.stringify(err.response.data));
//       });
// });

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

    [postPost.fulfilled]: (state, action) => {
      state.posts.unshift(action.payload as never);
      state.postsStatus = 'loaded';
    },
    [postPost.rejected]: (state) => {
      state.posts = [];
      state.postsStatus = 'error';
    }
  },
});

export const postsReducer = postsSlice.reducer;
