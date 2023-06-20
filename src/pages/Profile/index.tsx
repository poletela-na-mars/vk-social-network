import { useFormik } from 'formik';
import axios from '../../axios';
import { postValidationSchema } from './postValidationSchema';
import React, { SetStateAction, useEffect, useRef, useState } from 'react';
import { fetchAuthMe, selectIsAuth } from '../../redux/slices/auth';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { fetchUser } from '../../redux/slices/users';

import { convertDateToAge, formatDate, formatDateWithTime } from '../../utils/date';
import { isDataLoading } from '../../utils/data';
import { ADD_FRIEND, DELETE_FRIEND_OR_REQ, Mode } from '../../data/consts';

import { Box, Button, Container, Divider, IconButton, TextField, Typography, useTheme } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Loader } from '../../components';

import PeopleIcon from '@mui/icons-material/People';
import EditIcon from '@mui/icons-material/Edit';
import styles from './Profile.module.scss';

import { UserData } from '../../types/UserData';
import { fetchPosts } from '../../redux/slices/posts';
import { PostType } from '../../types/PostType';

// TODO - [WORK] - avatars the same size

export const Profile = () => {
  const theme = useTheme();

  const [curUser, setCurUserData] = useState<UserData>();
  const [authData, setAuthData] = useState<UserData | undefined>();
  const [actionWithFriendId, setActionWithFriendId] = useState<string>();
  const [like, setLike] = useState<boolean>(false);
  const [avatarUrlFromServ, setAvatarUrlFromServ] = useState();
  const [posts, setPosts] = useState<PostType[] | undefined>();

  const inputFileRef = useRef<HTMLInputElement | null>(null);

  const {id} = useParams();
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const navigate = useNavigate();

  const isCurUserDataLoading = isDataLoading(curUser);
  const isAuthDataLoading = isDataLoading(authData);

  const mode = Mode.My;

  const isMyProfile = (!isCurUserDataLoading && !isAuthDataLoading) && curUser?._id === authData?._id;

  const {touched, errors, isSubmitting, handleSubmit, handleChange, values} = useFormik({
    initialValues: {
      text: '',
    },
    enableReinitialize: true,
    validateOnChange: true,
    validationSchema: postValidationSchema,
    onSubmit: async (values, {resetForm}) => {
      try {
        await axios.post(`/posts`, values);
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
    dispatch(fetchUser({id}))
        .then((res: { payload: SetStateAction<UserData | undefined>; }) => setCurUserData(res.payload));
  }, [dispatch, id, avatarUrlFromServ]);

  useEffect(() => {
    dispatch(fetchAuthMe())
        .then((res: { payload: React.SetStateAction<UserData | undefined>; }) => setAuthData(res.payload));
  }, [actionWithFriendId]);

  useEffect(() => {
    dispatch(fetchPosts({id, mode}))
        .then((res: { payload: React.SetStateAction<PostType[] | undefined>; }) => setPosts(res.payload));
  }, [id, isSubmitting, like]);

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

  const handleLikeClick = async (postId: string) => {
    await axios.patch(`/posts/${postId}`);
    setLike(!like);
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
                          ? posts?.map((post) =>
                              <Box key={post._id} sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'flex-start'
                              }}>
                                <Container disableGutters
                                           sx={{display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                                  <img className={styles.avatarOnWall}
                                       src={curUser?.avatarUrl ? `${process.env.REACT_APP_API_URL}${curUser?.avatarUrl}` :
                                           '/default-avatar.png'}
                                       alt={`${curUser?.firstName} ${curUser?.lastName}`} />
                                  <Box
                                      sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'flex-start',
                                        marginLeft: '8px'
                                      }}
                                  >
                                    <Link to={`/user/${curUser?._id}`} className={styles.profileLink}
                                          style={{color: 'black', fontWeight: 'bold', marginBottom: '8px'}}>
                                      {`${curUser?.firstName} ${curUser?.lastName}`}
                                    </Link>
                                    <Typography color='lightgray'>{formatDateWithTime(post.createdAt)}</Typography>
                                  </Box>
                                </Container>
                                <Container disableGutters sx={{margin: '16px 0'}}>
                                  <Typography>{post.text}</Typography>
                                </Container>
                                <Button
                                    variant='outlined'
                                    endIcon={<FavoriteIcon />}
                                    onClick={() => handleLikeClick(post._id)}
                                >
                                  {post?.likes.length}
                                </Button>
                              </Box>)
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
