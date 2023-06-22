import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';

import { fetchAuthMe, selectIsAuth } from '../../redux/slices/auth';
import { fetchPosts } from '../../redux/slices/posts';

import { Container, Divider, Typography } from '@mui/material';

import { CurrentUserHeader, Loader, Post } from '../../components';

import { isDataLoading } from '../../utils/data';
import { Mode } from '../../data/consts';

import { UserData } from '../../types/UserData';
import { PostType } from '../../types/PostType';

export const Feed = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const navigate = useNavigate();

  const authUserData = useSelector((state: { auth: { data: UserData } }) => state.auth.data);
  const isAuthDataLoading = isDataLoading(authUserData);
  const id = authUserData?._id;

  const posts = useSelector((state: { posts: { posts: PostType[] } }) => state.posts.posts);
  const isPostsLoading = isDataLoading(posts);

  if (!window.localStorage.getItem('token') && !isAuth) {
    navigate('/login');
  }

  const firstRendered = useRef<boolean>(false);

  const mode = Mode.Friends;
  useEffect(() => {
    if (!firstRendered.current) {
      dispatch(fetchAuthMe());
      firstRendered.current = true;
    }
    if (!isAuthDataLoading) {
      dispatch(fetchPosts({id, mode}));
    }
  }, [isAuthDataLoading]);

  return (
      <Container maxWidth='lg'>
        {
          isAuthDataLoading || isPostsLoading
              ? <Loader />
              :
              <>
                <CurrentUserHeader authData={authUserData} />
                <Divider />
                {
                  posts.length !== 0
                      ? posts.map((post) => <Post key={post._id} {...post} />)
                      : <Typography variant='h5' component='p' color='lightgray' sx={{margin: '16px 0'}}>
                        Лента сейчас пустая
                      </Typography>
                }
              </>
        }
      </Container>
  );
};
