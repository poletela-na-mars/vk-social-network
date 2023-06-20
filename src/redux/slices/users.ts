import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../../axios';

// @ts-ignore
export const fetchUser: any = createAsyncThunk('users/fetchUser', async ({id}) => {
  return axios.get(`/user/${id}`)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.error(err.response.data);
        return Promise.reject(JSON.stringify(err.response.data));
      });
});

// @ts-ignore
export const updateUserData: any = createAsyncThunk('users/fetchUser', async ({id, data}) => {
  return axios.patch(`/user/${id}`, data)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.error(err.response.data);
        return Promise.reject(JSON.stringify(err.response.data));
      });
});

// @ts-ignore
export const fetchUsers: any = createAsyncThunk('users/fetchUsers', async ({id, section, act}) => {
  return axios.get(`/${id}/users`, {params: {section: section, act: act}})
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.error(err.response.data);
        return Promise.reject(JSON.stringify(err.response.data));
      });
});

const initialState = {
  user: null,
  userStatus: 'loading',
  users: [],
  usersStatus: 'loading',
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchUser.pending]: (state) => {
      state.user = null;
      state.userStatus = 'loading';
    },
    [fetchUser.fulfilled]: (state, action) => {
      state.user = action.payload;
      state.userStatus = 'loaded';
    },
    [fetchUser.rejected]: (state) => {
      state.user = null;
      state.userStatus = 'error';
    },
    [updateUserData.pending]: (state) => {
      state.user = null;
      state.userStatus = 'loading';
    },
    [updateUserData.fulfilled]: (state, action) => {
      state.user = action.payload;
      state.userStatus = 'loaded';
    },
    [updateUserData.rejected]: (state) => {
      state.user = null;
      state.userStatus = 'error';
    },
    [fetchUsers.pending]: (state) => {
      state.users = [];
      state.usersStatus = 'loading';
    },
    [fetchUsers.fulfilled]: (state, action) => {
      state.users = action.payload;
      state.usersStatus = 'loaded';
    },
    [fetchUsers.rejected]: (state) => {
      state.users = [];
      state.usersStatus = 'error';
    },
  }
});

export const usersReducer = usersSlice.reducer;
