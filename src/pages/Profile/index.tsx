import { useFormik } from 'formik';
import axios from '../../axios';
import { postValidationSchema } from './postValidationSchema';
import React, { SetStateAction, useEffect, useState } from 'react';
import { fetchAuthMe, selectIsAuth } from '../../redux/slices/auth';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { convertDateToAge, formatDate } from '../../utils/date';

import { Box, Button, Container, Divider, IconButton, TextField, Typography, useTheme } from '@mui/material';
import { Loader } from '../../components';

import PeopleIcon from '@mui/icons-material/People';
import EditIcon from '@mui/icons-material/Edit';
import styles from './Profile.module.scss';
import { fetchUser } from '../../redux/slices/users';
import { isDataLoading } from '../../utils/data';

import { UserData } from '../../types/UserData';
import { ADD_FRIEND, DELETE_FRIEND_OR_REQ } from '../../data/consts';

export const Profile = () => {
  const theme = useTheme();

  const [curUser, setCurUserData] = useState<UserData>();
  const [authData, setAuthData] = useState<UserData | undefined>();
  const [actionWithFriendId, setActionWithFriendId] = useState<string>();

  const {id} = useParams();
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  // const authData = useSelector((state: any) => state.auth.data);
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
    dispatch(fetchUser({id})).then((res: { payload: SetStateAction<UserData | undefined>; }) => setCurUserData(res.payload));
  }, [dispatch, id]);

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
                      <img className={styles.avatar} src={curUser?.avatarUrl || '/default-avatar.png'}
                           alt={`${curUser?.firstName} ${curUser?.lastName}`} />
                      {isMyProfile
                          ?
                          <>
                            <Button
                                style={{
                                  textTransform: 'none',
                                  fontSize: '16px',
                                }}
                            >
                              Изменить фото
                            </Button>
                            <Button
                                style={{
                                  textTransform: 'none',
                                  fontSize: '16px',
                                }}
                            >
                              Удалить фото
                            </Button>
                          </>
                          :
                          <Button onClick={() => handleAddReqOrDeleteFriendButtonClick(curUser?._id)}>
                            {isMyFriend(curUser?._id) ? 'Удалить из друзей' : (isReqSent(curUser?._id) ? 'Отменить заявку' :'Добавить в друзья')}
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
                      <Typography variant='h5' component='p' sx={{marginBottom: '16px'}}>
                        {`${curUser?.firstName} ${curUser?.lastName}`}
                      </Typography>
                      <Typography variant='h5' component='p' sx={{marginBottom: '16px'}}>
                        {`Дата рождения: ${formatDate(curUser?.birthday)}`}
                      </Typography>
                      <Typography variant='h5' component='p' sx={{marginBottom: '16px'}}>
                        {`Возраст: ${convertDateToAge(curUser?.birthday)}`}
                      </Typography>
                      {curUser?.city &&
                          <Typography variant='h5' component='p' sx={{marginBottom: '16px'}}>
                            {`Город: ${curUser?.city}`}
                          </Typography>
                      }
                      {curUser?.uniOrJob &&
                          <Typography variant='h5' component='p' sx={{marginBottom: '16px'}}>
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
