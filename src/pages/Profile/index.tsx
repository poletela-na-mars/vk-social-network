import React, { useEffect, useRef } from 'react';
import { selectIsAuth } from '../../redux/slices/auth';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import axios from '../../axios';

import { postValidationSchema } from './postValidationSchema';
import { addFriend, deleteFriend, fetchUser, updateUserData } from '../../redux/slices/users';
import { fetchPosts, postPost } from '../../redux/slices/posts';

import { convertDateToAge, formatDate } from '../../utils/date';
import { isDataLoading } from '../../utils/data';
import { Mode } from '../../data/consts';

import { Box, Button, Container, Divider, IconButton, TextField, Typography, useTheme } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import EditIcon from '@mui/icons-material/Edit';
import styles from './Profile.module.scss';

import { Loader, Post } from '../../components';

import { UserData } from '../../types/UserData';
import { PostType } from '../../types/PostType';

export const Profile = () => {
  const theme = useTheme();

  const inputFileRef = useRef<HTMLInputElement | null>(null);

  const {id} = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const mode = Mode.My;

  const isAuth = useSelector(selectIsAuth);
  const authUserData = useSelector((state: { auth: { data: UserData } }) => state.auth.data);
  const user = useSelector((state: { users: { user: UserData } }) => state.users.user);
  const posts = useSelector((state: { posts: { posts: PostType[] } }) => state.posts.posts);

  const isCurUserDataLoading = isDataLoading(user);
  const isAuthDataLoading = isDataLoading(authUserData);
  const isPostsLoading = isDataLoading(posts);

  const isMyProfile = (!isCurUserDataLoading && !isAuthDataLoading) && user?._id === authUserData?._id;

  const {touched, errors, isSubmitting, handleSubmit, handleChange, values} = useFormik({
    initialValues: {
      text: '',
      user: authUserData?._id,
    },
    enableReinitialize: true,
    validateOnChange: true,
    validationSchema: postValidationSchema,
    onSubmit: async (values, {resetForm}) => {
      try {
        await dispatch(postPost({values}));
        // await axios.post(`/posts`, values);
      } catch (err) {
        console.log(err);
        // TODO - [WORK] - add error messaging
        // TODO - [WORK] - add image upload
      }
      console.log(values);
      resetForm({});
    },
  });

  useEffect(() => {
    dispatch(fetchUser({id}));
    dispatch(fetchPosts({id, mode}));
  }, []);

  if (!window.localStorage.getItem('token') && !isAuth) {
    navigate('/login');
  }

  const goToEditProfilePage = () => {
    navigate(`/users/${authUserData?._id}/edit`);
  };

  const goToFriendsPage = () => {
    navigate(`/users/${user?._id}/friends`);
  };

  const isMyFriend = user?.friends.includes(authUserData?._id as never);
  const isReqSent = user?.inFriendsReq.includes(authUserData?._id as never);

  const handleAddReqOrDeleteFriendButtonClick = async (friendId: string | undefined) => {
    try {
      if (isMyFriend || isReqSent) {
        await dispatch(deleteFriend({authUserData, friendId}));
      } else {
        await dispatch(addFriend({authUserData, friendId}));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const uploadAvatar = async (file: Blob) => {
    if (file) {
      const formData = new FormData();
      formData.append('image', file);
      const {data} = await axios.post('/upload', formData);

      return data;
    }

    return null;
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const target = event.target as HTMLInputElement;
      const files = target.files;
      if (files !== null) {
        const targetFile = files[0];
        if (targetFile.type !== 'image/jpeg' && targetFile.type !== 'image/png') {
          throw new Error('Недопустимый формат файла.');
        }

        const reFileName = /^[А-яёЁ a-zA-Z0-9_-]{1,80}\.[a-zA-Z]{1,8}$/;
        if (!reFileName.test(targetFile.name)) {
          throw new Error('Недопустимое имя или расширение файла.');
        }

        const maxSize = 5 * 1024 * 1024; // 5MB
        const minSize = 5 * 1024;
        if (targetFile.size >= maxSize || targetFile.size <= minSize) {
          throw new Error('Изображение слишком большое или слишком маленькое.');
        }

        const data = await uploadAvatar(targetFile);
        await dispatch(updateUserData({id, data}));
        event.target.files = null;
        event.target.value = '';
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      axios.delete(`/upload/removeAvatar`, {data: {avatarUrl: user?.avatarUrl}})
          .catch((err) => {
            console.error(err.response.data.message);
            return Promise.reject(err.response.data.message);
          });

      const {data} = {data: {avatarUrl: ''}};
      await dispatch(updateUserData({id, data}));

    } catch (err) {
      console.error(err);
    }
  };

  return (
      <Container maxWidth='lg'>
        {isCurUserDataLoading || isAuthDataLoading || isPostsLoading
            ? <Loader />
            : (
                <>
                  <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-evenly',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        margin: '16px 0',
                      }}
                  >
                    <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          margin: '16px 0',
                        }}>
                      <img className={styles.avatar}
                           src={user?.avatarUrl ? `${process.env.REACT_APP_API_URL}${user?.avatarUrl}` :
                               '/default-avatar.png'}
                           alt={`${user?.firstName} ${user?.lastName}`} />
                      {isMyProfile
                          ?
                          <>
                            <Button
                                style={{
                                  textTransform: 'none',
                                  fontSize: '16px',
                                }}
                                onClick={() => inputFileRef.current?.click()}
                            >
                              Изменить фото
                            </Button>
                            <input ref={inputFileRef} type='file' onChange={(e) => handleFileChange(e)} hidden />
                            <Button
                                style={{
                                  textTransform: 'none',
                                  fontSize: '16px',
                                }}
                                onClick={handleRemoveAvatar}
                                disabled={!user?.avatarUrl}
                            >
                              Удалить фото
                            </Button>
                          </>
                          :
                          <Button onClick={() => handleAddReqOrDeleteFriendButtonClick(user?._id)}>
                            {isMyFriend ? 'Удалить из друзей' :
                                (isReqSent ? 'Отменить заявку' : 'Добавить в друзья')}
                          </Button>
                      }
                      <Button
                          variant='outlined'
                          endIcon={<PeopleIcon />}
                          sx={{margin: '16px'}}
                          onClick={goToFriendsPage}
                      >
                        Друзья
                      </Button>
                    </Box>
                    <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          margin: '16px 16px',
                        }}
                    >
                      <Typography align='center' variant='h5' component='p' sx={{marginBottom: '16px'}}>
                        {`${user?.firstName} ${user?.lastName}`}
                      </Typography>
                      <Typography align='center' variant='h5' component='p' sx={{marginBottom: '16px'}}>
                        {`Дата рождения: ${formatDate(user?.birthday)}`}
                      </Typography>
                      <Typography align='center' variant='h5' component='p' sx={{marginBottom: '16px'}}>
                        {`Возраст: ${convertDateToAge(user?.birthday)}`}
                      </Typography>
                      {user?.city &&
                          <Typography align='center' variant='h5' component='p' sx={{marginBottom: '16px'}}>
                            {`Город: ${user?.city}`}
                          </Typography>
                      }
                      {user?.uniOrJob &&
                          <Typography align='center' variant='h5' component='p' sx={{marginBottom: '16px'}}>
                            {`Вуз/Место работы: ${user?.uniOrJob}`}
                          </Typography>
                      }
                      {isMyProfile &&
                          <IconButton
                              color='primary'
                              onClick={goToEditProfilePage}
                          >
                            <EditIcon />
                          </IconButton>
                      }
                    </Box>
                  </Box>
                  {isMyProfile &&
                      <>
                        <Divider />
                        <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'flex-start',
                              alignItems: 'center',
                              margin: '16px',
                            }}
                        >
                          <form onSubmit={handleSubmit}>
                            <Typography color={theme.palette.primary.main} variant='h5' component='p'
                                        sx={{margin: '16px'}}>
                              Что у вас нового?
                            </Typography>
                            <TextField
                                multiline={true}
                                rows={6}
                                fullWidth
                                inputProps={{maxLength: 50}}
                                autoComplete='off'
                                placeholder='Текст вашего поста...'
                                id='text'
                                name='text'
                                value={values.text}
                                onChange={handleChange}
                                error={touched.text && Boolean(errors.text)}
                                helperText={touched.text && errors.text}
                                sx={{marginBottom: '16px', minWidth: '300px', width: '30vw'}}
                                InputProps={{sx: {borderRadius: '20px'}}}
                            />
                            <Container
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'flex-end',
                                  alignItems: 'center',
                                  width: '100%',
                                  padding: 0,
                                }}
                            >
                              <Button
                                  variant='contained'
                                  size='small'
                                  type='submit'
                                  disabled={isSubmitting}
                                  sx={{
                                    textTransform: 'none',
                                    fontSize: '16px',
                                    margin: '16px',
                                  }}
                              >
                                Опубликовать
                              </Button>
                            </Container>
                          </form>
                        </Box>
                      </>
                  }
                  <Divider sx={{
                    '& .MuiDivider-wrapper': {
                      color: theme.palette.primary.main
                    }
                  }}
                  >
                    Стена
                  </Divider>
                  <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        margin: '16px 0',
                      }}
                  >
                    {
                      posts?.length !== 0
                          ? posts.map((post) => <Post key={post._id} {...post} />)
                          : <Typography variant='h5' component='p' color='lightgray' sx={{margin: '16px'}}>
                            Стена сейчас пустая
                          </Typography>
                    }
                  </Box>
                </>
            )
        }
      </Container>
  );
};
