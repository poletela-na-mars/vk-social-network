import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../../axios';

// @ts-ignore
export const fetchUser: any = createAsyncThunk('auth/fetchUser', async ({id}) => {
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
export const fetchUsers: any = createAsyncThunk('auth/fetchUsers', async ({id, section, act}) => {
  return axios.get(`/${id}/users`, { params: { section: section, act: act } })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.error(err.response.data);
        return Promise.reject(JSON.stringify(err.response.data));
      });
});

const initialState = {
  data: null,
  status: 'loading',
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchUser.pending]: (state) => {
      state.data = null;
      state.status = 'loading';
    },
    [fetchUser.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.status = 'loaded';
    },
    [fetchUser.rejected]: (state) => {
      state.data = null;
      state.status = 'error';
    },
    [fetchUsers.pending]: (state) => {
      state.data = null;
      state.status = 'loading';
    },
    [fetchUsers.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.status = 'loaded';
    },
    [fetchUsers.rejected]: (state) => {
      state.data = null;
      state.status = 'error';
    },
  }
});

export const usersReducer = usersSlice.reducer;
