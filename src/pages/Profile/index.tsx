import { Box, Button, CircularProgress, Container, Typography } from '@mui/material';
import { useEffect } from 'react';
import { fetchUser, selectIsAuth } from '../../redux/slices/auth';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useParams } from 'react-router-dom';
import { convertDateToAge, formatDate } from '../../utils/date';

import styles from './Profile.module.scss';

export const Profile = () => {
  const {id} = useParams();
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const userData = useSelector((state: any) => state.auth.data);
  const isUserDataLoading = userData === undefined || userData === null;

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
                        marginTop: 2,
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
                          margin: '0 16px',
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
                          <Typography variant='h5' component='p' sx={{marginBottom: '16px'}}>
                            {`Вуз/Место работы: ${userData?.uniOrJob}`}
                          </Typography>
                          : null
                      }
                    </Box>
                  </Box>
                </>
            )
        }
      </Container>
  );
};
