import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider, TextField,
  Typography,
  useTheme
} from '@mui/material';
import { useEffect } from 'react';
import { fetchUser, selectIsAuth } from '../../redux/slices/auth';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useParams } from 'react-router-dom';
import { convertDateToAge, formatDate } from '../../utils/date';

import PeopleIcon from '@mui/icons-material/People';
import styles from './Profile.module.scss';
import { useFormik } from 'formik';
import { postValidationSchema } from './postValidationSchema';

export const Profile = () => {
  const theme = useTheme();

  const {id} = useParams();
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const userData = useSelector((state: any) => state.auth.data);
  const isUserDataLoading = userData === undefined || userData === null;

  const {touched, errors, isSubmitting, handleSubmit, handleChange, values} = useFormik({
    initialValues: {
      postInput: '',
    },
    enableReinitialize: true,
    validateOnChange: true,
    validationSchema: postValidationSchema,
    onSubmit: async (values: object) => {
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
    },
  });

  useEffect(() => {
    dispatch(fetchUser({id}));
  }, [dispatch, id]);

  if (!window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to='/login' />;
  }

  return (
      <Container maxWidth='lg'>
        {isUserDataLoading
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
                          marginBottom: '16px',
                        }}>
                      <img className={styles.avatar} src={userData?.avatarUrl || '/default-avatar.png'}
                           alt={`${userData?.lastName} ${userData?.firstName}`} />
                      <Button>Изменить фото</Button>
                      <Button>Удалить фото</Button>
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
                        {`${userData?.lastName} ${userData?.firstName}`}
                      </Typography>
                      <Typography variant='h5' component='p' sx={{marginBottom: '16px'}}>
                        {`Дата рождения: ${formatDate(userData?.birthday)}`}
                      </Typography>
                      <Typography variant='h5' component='p' sx={{marginBottom: '16px'}}>
                        {`Возраст: ${convertDateToAge(userData?.birthday)}`}
                      </Typography>
                      {userData?.city
                          ?
                          <Typography variant='h5' component='p' sx={{marginBottom: '16px'}}>
                            {`Город: ${userData?.city}`}
                          </Typography>
                          : null
                      }
                      {userData?.uniOrJob
                          ?
                          <Typography variant='h5' component='p'>
                            {`Вуз/Место работы: ${userData?.uniOrJob}`}
                          </Typography>
                          : null
                      }
                    </Box>
                  </Box>
                  <Divider />
                  <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-evenly',
                        alignItems: 'flex-start',
                        flexWrap: 'wrap',
                        margin: '16px 0',
                      }}
                  >
                    <Button
                        variant='outlined'
                        endIcon={<PeopleIcon />}
                        sx={{margin: '16px'}}
                    >
                      Друзья
                    </Button>
                    <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'flex-start',
                          alignItems: 'center',
                          margin: '0 16px',
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
                              }}
                          >
                            Опубликовать
                          </Button>
                        </Container>
                      </form>
                    </Box>
                  </Box>
                </>
            )
        }
      </Container>
  );
};
