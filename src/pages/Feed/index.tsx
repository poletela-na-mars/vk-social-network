import { Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAuthMe, selectIsAuth } from '../../redux/slices/auth';
import React, { useEffect, useState } from 'react';
import { fetchPosts } from '../../redux/slices/posts';

import { isDataLoading } from '../../utils/data';
import { Container } from '@mui/material';

import { UserData } from '../../types/UserData';
import { Mode } from '../../data/consts';
import { Loader } from '../../components';

export const Feed = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const navigate = useNavigate();

  const authData: UserData = useSelector((state: any) => state.auth.data);
  const isAuthDataLoading = isDataLoading(authData);
  const id = authData?._id;

  const [posts, setPosts] = useState<any>();
  // const posts = useSelector((state: any) => state.posts.items);
  const arePostsLoading = posts === undefined;

  if (!window.localStorage.getItem('token') && !isAuth) {
    navigate('/login');
  }

  const mode = Mode.Friends;
  useEffect(() => {
    if (!isAuthDataLoading && !arePostsLoading) {
      dispatch(fetchPosts({id, mode}))
          .then((res: { payload: React.SetStateAction<undefined> }) => setPosts(res.payload));
    }
  }, [isAuthDataLoading, arePostsLoading])

  useEffect(() => {
    dispatch(fetchAuthMe());
  }, []);

  // TODO - Функциональность ленты не доделана, на стене пользователя есть баги. Полноценная логика - Друзья, Поиск друзей,
  //  Авторизация, Регистрация, Загрузка/Удаление аватара, Создание поста, Редактирование профиля
  return (
      <Container maxWidth='lg'>
        { isAuthDataLoading
            ? <Loader />
            : <Navigate to={`/user/${id}`} />
        }
        {/*{isAuthDataLoading || arePostsLoading*/}
        {/*    ? <Loader />*/}
        {/*    :*/}
        {/*    <>*/}
        {/*      <CurrentUserHeader authData={authData} />*/}
        {/*      <Divider />*/}
        {/*      {*/}
        {/*        posts?.map((post: any) => <Post key={post._id} postId={post._id} />)*/}
        {/*      }*/}
        {/*    </>*/}
        {/*}*/}
      </Container>
  );
};
