import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './slices/auth';
import { usersReducer } from './slices/users';
import { postsReducer } from './slices/posts';

const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    posts: postsReducer,
  },
});

export default store;
