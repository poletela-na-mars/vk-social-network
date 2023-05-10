import { useFormik } from 'formik';
import axios from '../../axios';
import { postValidationSchema } from './postValidationSchema';
import React, { SetStateAction, useEffect, useRef, useState } from 'react';
import { fetchAuthMe, selectIsAuth } from '../../redux/slices/auth';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { convertDateToAge, formatDate } from '../../utils/date';
import { fetchUser } from '../../redux/slices/users';
import { isDataLoading } from '../../utils/data';
import { ADD_FRIEND, DELETE_FRIEND_OR_REQ } from '../../data/consts';

import { Box, Button, Container, Divider, IconButton, TextField, Typography, useTheme } from '@mui/material';
import { Loader } from '../../components';

import PeopleIcon from '@mui/icons-material/People';
import EditIcon from '@mui/icons-material/Edit';
import styles from './Profile.module.scss';

import { UserData } from '../../types/UserData';

export const Profile = () => {
  const theme = useTheme();

  const [curUser, setCurUserData] = useState<UserData>();
  const [authData, setAuthData] = useState<UserData | undefined>();
  const [actionWithFriendId, setActionWithFriendId] = useState<string>();
  const [avatarUrlFromServ, setAvatarUrlFromServ] = useState();

  const inputFileRef = useRef<HTMLInputElement | null>(null);

  const {id} = useParams();
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const navigate = useNavigate();

  const isCurUserDataLoading = isDataLoading(curUser);
  const isAuthDataLoading = isDataLoading(authData);

  const isMyProfile = (!isCurUserDataLoading && !isAuthDataLoading) && curUser?._id === authData?._id;

  const {touched, errors, isSubmitting, handleSubmit, handleChange, values} = useFormik({
    initialValues: {
      postInput: '',
    },
    enableReinitialize: true,
    validateOnChange: true,
    validationSchema: postValidationSchema,
    onSubmit: async (values, {resetForm}) => {
      // try {
      //   const data = await dispatch(fetchAuth(values));
      //
      //   if (data.meta.requestStatus === 'rejected') {
      //     await Promise.reject(data.error.message);
      //   } else if ('token' in data?.payload) {
      //     window.localStorage.setItem('token', data.payload.token);
      //   }
      // } catch (err) {
      //   console.log(err);
      //   // TODO - [WORK] - add error messaging
      //   // setError('LoginError', { type: 'custom', message: err });
      // }
      console.log(values);
      resetForm({});
    },
  });

  useEffect(() => {
    dispatch(fetchUser({id}))
        .then((res: { payload: SetStateAction<UserData | undefined>; }) => setCurUserData(res.payload));
  }, [dispatch, id, avatarUrlFromServ]);

  useEffect(() => {
    dispatch(fetchAuthMe())
        .then((res: { payload: React.SetStateAction<UserData | undefined>; }) => setAuthData(res.payload));
  }, [actionWithFriendId]);

  if (!window.localStorage.getItem('token') && !isAuth) {
    navigate('/login');
  }

  const goToEditProfilePage = () => {
    navigate(`/user/${authData?._id}/edit`);
  };

  const goToFriendsPage = () => {
    navigate(`/user/${curUser?._id}/friends`);
  };

  const isMyFriend = (friendId: string | undefined) => {
    return authData?.friends.includes(friendId as never);
  };

  const isReqSent = (friendId: string | undefined) => {
    return authData?.outFriendsReq.includes(friendId as never);
  };

  const handleAddReqOrDeleteFriendButtonClick = async (friendId: string | undefined) => {
    try {
      if (friendId !== undefined) {
        if (isMyFriend(friendId) || isReqSent(friendId)) {
          await axios.delete(`/user/${authData?._id}/friend/${friendId}`);
          setActionWithFriendId(DELETE_FRIEND_OR_REQ);
        } else {
          await axios.put(`/user/${authData?._id}/friend/${friendId}`);
          setActionWithFriendId(ADD_FRIEND);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const uploadAvatar = async (file: Blob) => {
    if (file) {
      const formData = new FormData();
      console.log(file);
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
        await axios.patch(`/user/${id}`, data);
        setAvatarUrlFromServ(data);
        event.target.files = null;
        event.target.value = '';
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      axios.delete(`/upload/removeAvatar`, {data: {avatarUrl: curUser?.avatarUrl}})
          .catch((err) => {
            console.error(err.response.data.message);
            return Promise.reject(err.response.data.message);
          });
      axios.patch(`/user/${id}`, {avatarUrl: ''})
          .catch((err) => {
            console.error(err.response.data.message);
            return Promise.reject(err.response.data.message);
          });
      setAvatarUrlFromServ(undefined);
    } catch (err) {
      console.error(err);
    }
  };

  return (
      <Container maxWidth='lg'>
        {isCurUserDataLoading || isAuthDataLoading
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
                           src={curUser?.avatarUrl ? `${process.env.REACT_APP_API_URL}${curUser?.avatarUrl}` :
                               '/default-avatar.png'}
                           alt={`${curUser?.firstName} ${curUser?.lastName}`} />
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
                                disabled={!curUser?.avatarUrl}
                            >
                              Удалить фото
                            </Button>
                          </>
                          :
                          <Button onClick={() => handleAddReqOrDeleteFriendButtonClick(curUser?._id)}>
                            {isMyFriend(curUser?._id) ? 'Удалить из друзей' :
                                (isReqSent(curUser?._id) ? 'Отменить заявку' : 'Добавить в друзья')}
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
                        {`${curUser?.firstName} ${curUser?.lastName}`}
                      </Typography>
                      <Typography align='center' variant='h5' component='p' sx={{marginBottom: '16px'}}>
                        {`Дата рождения: ${formatDate(curUser?.birthday)}`}
                      </Typography>
                      <Typography align='center' variant='h5' component='p' sx={{marginBottom: '16px'}}>
                        {`Возраст: ${convertDateToAge(curUser?.birthday)}`}
                      </Typography>
                      {curUser?.city &&
                          <Typography align='center' variant='h5' component='p' sx={{marginBottom: '16px'}}>
                            {`Город: ${curUser?.city}`}
                          </Typography>
                      }
                      {curUser?.uniOrJob &&
                          <Typography align='center' variant='h5' component='p' sx={{marginBottom: '16px'}}>
                            {`Вуз/Место работы: ${curUser?.uniOrJob}`}
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
                                id='postInput'
                                name='postInput'
                                value={values.postInput}
                                onChange={handleChange}
                                error={touched.postInput && Boolean(errors.postInput)}
                                helperText={touched.postInput && errors.postInput}
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
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        margin: '16px',
                      }}
                  >
                    <Typography variant='h5' component='p' sx={{margin: '16px'}}>
                      Стена сейчас пустая
                    </Typography>
                  </Box>
                </>
            )
        }
      </Container>
  );
};
