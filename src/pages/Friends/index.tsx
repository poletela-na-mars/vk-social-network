import React, { SetStateAction, useEffect, useState } from 'react';
import { selectIsAuth } from '../../redux/slices/auth';
import { fetchUser, fetchUsers } from '../../redux/slices/users';
import { isDataLoading } from '../../utils/data';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Box, Container, InputAdornment, Tab, Tabs, TextField } from '@mui/material';
import { Loader, PeopleList } from '../../components';
import { Search } from '@mui/icons-material';

import { UserData } from '../../types/UserData';

export const Friends = () => {
  const [userData, setUserData] = useState<UserData | undefined>();
  const [usersData, setUsersData] = useState<UserData[] | undefined>();
  const [tabValue, setTabValue] = useState<string>('friends');
  const [searchReq, setSearchReq] = useState<string>('');

  const {id} = useParams();
  const useQuery = () => new URLSearchParams(useLocation().search);
  const query = useQuery();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuth = useSelector(selectIsAuth);
  const authData = useSelector((state: any) => state.auth.data);

  const isUsersDataLoading = isDataLoading(usersData);
  const isUserDataLoading = isDataLoading(userData);
  const isAuthDataLoading = isDataLoading(authData);

  if (!window.localStorage.getItem('token') && !isAuth) {
    navigate('/login');
  }

  const areMyFriends = (!isUserDataLoading && !isAuthDataLoading) && userData?._id === authData?._id;

  console.log(areMyFriends);

  const section = query.get('section');
  const act = query.get('act');

  useEffect(() => {
    dispatch(fetchUser({id}))
        .then((res: { payload: React.SetStateAction<UserData | undefined>; }) => setUserData(res.payload));
    dispatch(fetchUsers({id, section, act}))
        .then((res: { payload: React.SetStateAction<UserData[] | undefined>; }) => setUsersData(res.payload));
  }, []);

  useEffect(() => {
    switch (tabValue) {
      case 'friends':
        navigate(`/user/${id}/friends`);
        break;
      case 'requests':
        navigate(`/user/${id}/friends?section=all_requests`);
        break;
      case 'people':
        navigate(`/user/${id}/friends?act=find`);
        break;
    }
  }, [tabValue]);

  const handleChangeSearchReq = (event: { target: { value: SetStateAction<string>; }; }) => {
    setSearchReq(event.target.value);
  };

  const handleTabValueChange = (event: React.SyntheticEvent, value: React.SetStateAction<string>) => {
    setTabValue(value);
  };

  return (
      isUsersDataLoading || isUserDataLoading || isAuthDataLoading
          ? <Loader />
          : <>
            <Container
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '15px'
                }}
            >
              <PeopleList section={section} usersData={usersData} areMyFriends={areMyFriends} />
              <Box sx={{display: 'flex', flexDirection: 'column', marginLeft: '16px'}}>
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
                <Tabs value={tabValue} onChange={handleTabValueChange} aria-label='side-tabs' orientation='vertical'>
                  <Tab value='friends' label='Друзья' />
                  {areMyFriends && <Tab value='requests' label='Заявки в друзья' />}
                  <Tab value='people' label='Все люди' />
                </Tabs>
              </Box>
            </Container>
          </>
  );
};
