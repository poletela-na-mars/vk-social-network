import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchAuth: any = createAsyncThunk('auth/fetchAuth', async (params) => {
  return axios.post('/auth/login', params)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.error(err.response.data.message);
        return Promise.reject(err.response.data.message);
      });
});

export const fetchRegister: any = createAsyncThunk('auth/fetchRegister', async (params) => {
  return axios.post('/auth/register', params)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.error(err.response.data);
        return Promise.reject(JSON.stringify(err.response.data));
      });
});

export const fetchAuthMe: any = createAsyncThunk('auth/fetchAuthMe', async () => {
  const {data} = await axios.get('/auth/me');
  return data;
});

// @ts-ignore
export const fetchUser: any = createAsyncThunk('auth/fetchUser', async ({ id }) => {
  const { data } = await axios.get(`/user/${id}`);
  return data;
});

const initialState = {
  data: null,
  status: 'loading',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.data = null;
    }
  },
  extraReducers: {
    [fetchAuth.pending]: (state) => {
      state.data = null;
      state.status = 'loading';
    },
    [fetchAuth.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.status = 'loaded';
    },
    [fetchAuth.rejected]: (state) => {
      state.data = null;
      state.status = 'error';
    },
    [fetchAuthMe.pending]: (state) => {
      state.data = null;
      state.status = 'loading';
    },
    [fetchAuthMe.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.status = 'loaded';
    },
    [fetchAuthMe.rejected]: (state) => {
      state.data = null;
      state.status = 'error';
    },
    [fetchRegister.pending]: (state) => {
      state.data = null;
      state.status = 'loading';
    },
    [fetchRegister.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.status = 'loaded';
    },
    [fetchRegister.rejected]: (state) => {
      state.data = null;
      state.status = 'error';
    },
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
  }
});

export const selectIsAuth = (state: any) => {
  return Boolean(state.auth.data);
};

export const authReducer = authSlice.reducer;

export const {logout} = authSlice.actions;
