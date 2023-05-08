import { SetStateAction, useEffect, useState } from 'react';
import { fetchUsers, selectIsAuth } from '../../redux/slices/auth';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Box, Container, Divider, InputAdornment, Link, TextField, Typography } from '@mui/material';
import { Loader } from '../../components';
import styles from './Friends.module.scss';
import { convertDateToAge } from '../../utils/date';
import { Search } from '@mui/icons-material';

export const Friends = () => {
  const [usersData, setUsersData] = useState<any>();
  const [searchReq, setSearchReq] = useState('');

  const {id} = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuth = useSelector(selectIsAuth);
  const userData = useSelector((state: any) => state.auth.data);
  const isUsersDataLoading = usersData === undefined || usersData === null;

  useEffect(() => {
    dispatch(fetchUsers({id})).then((res: { payload: object }) => setUsersData(res.payload));
  }, []);

  if (!window.localStorage.getItem('token') && !isAuth) {
    navigate('/login');
  }

  const handleChangeSearchReq = (event: { target: { value: SetStateAction<string>; }; }) => {
    setSearchReq(event.target.value);
  };

  return (
      isUsersDataLoading
          ? <Loader />
          : <>
            <Divider />
            <Box
                sx={{
                  height: 'calculate(100vh - 60px)',
                  display: 'grid',
                  gap: 1,
                  gridTemplate: '1fr /  4fr 2fr',
                  margin: '16px',
                }}
            >
              <Box sx={{
                gridArea: '1 / 1 / 1 / 1',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center'
              }}>
                {
                  usersData?.map((user: any) =>
                      <Container
                          sx={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            marginBottom: '16px',
                          }}
                      >
                        <img className={styles.avatar} src={user?.avatarUrl || '/default-avatar.png'}
                             alt={`${user?.firstName} ${user?.lastName}`} />
                        <Typography>
                          {`${user?.firstName} ${user?.lastName}, ${convertDateToAge(
                              user?.birthday)}`}
                        </Typography>
                      </Container>
                  )
                }
              </Box>
              <Box
                  sx={{
                    gridArea: '1 / 2 / 1 / 2',
                  }}
              >
                <Container
                    sx={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start'}}
                >
                  <TextField
                      name='searchField'
                      size='small'
                      inputProps={{maxLength: 50}}
                      placeholder='Поиск...'
                      id='searchField'
                      value={searchReq}
                      onChange={handleChangeSearchReq}
                      sx={{maxWidth: '300px', marginBottom: '16px'}}
                      InputProps={{
                        endAdornment:
                            <InputAdornment position='end'>
                              <Search />
                            </InputAdornment>
                      }}
                      autoComplete='on'
                  />
                  <Link href='/' className={styles.sideLinks}>Друзья</Link>
                  <Link href='/' className={styles.sideLinks}>Заявки в друзья</Link>
                  <Link href='/' className={styles.sideLinks}>Все люди</Link>
                </Container>
              </Box>
            </Box>
            {/*<Tabs style={{ marginBottom: 15 }} value={tabValue} onChange={handleTabValueChange} aria-label='tabs'>*/}
            {/*  <Tab label='Друзья' />*/}
            {/*  <Tab label='Все люди' />*/}
            {/*  <Tab label='По тегам' disabled={true} />*/}
            {/*</Tabs>*/}
          </>
  );
};
