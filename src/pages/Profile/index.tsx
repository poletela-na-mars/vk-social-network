import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import { useFormik } from 'formik';
import { postValidationSchema } from './postValidationSchema';
import { useEffect, useState } from 'react';
import { fetchUser, selectIsAuth } from '../../redux/slices/auth';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { convertDateToAge, formatDate } from '../../utils/date';

import PeopleIcon from '@mui/icons-material/People';
import EditIcon from '@mui/icons-material/Edit';
import styles from './Profile.module.scss';

export const Profile = () => {
  const theme = useTheme();

  const [curUser, setCurUserData] = useState<any>();

  const {id} = useParams();
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const navigate = useNavigate();
  const userData = useSelector((state: any) => state.auth.data);
  const isCurUserDataLoading = curUser === undefined || curUser === null;

  const isMyProfile = !isCurUserDataLoading && curUser?._id === userData?._id;

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
    dispatch(fetchUser({id})).then((res: { payload: object }) => setCurUserData(res.payload));
  }, []);

  if (!window.localStorage.getItem('token') && !isAuth) {
    navigate('/login');
  }

  const goToEditProfile = () => {
    navigate(`/user/${curUser._id}/edit`);
  };

  return (
      <Container maxWidth='lg'>
        {isCurUserDataLoading
            ? <Box
                sx={{
                  display: 'flex',
                  height: 'calc(100vh - 60px)',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
              <CircularProgress />
            </Box>
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
                           alt={`${curUser?.lastName} ${curUser?.firstName}`} />
                      {isMyProfile
                          ?
                          <>
                            <Button>Изменить фото</Button>
                            <Button>Удалить фото</Button>
                          </>
                          :
                          <Button>Добавить в друзья</Button>
                      }
                      <Button
                          variant='outlined'
                          endIcon={<PeopleIcon />}
                          sx={{margin: '16px'}}
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
                        {`${curUser?.lastName} ${curUser?.firstName}`}
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
                              onClick={goToEditProfile}
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
