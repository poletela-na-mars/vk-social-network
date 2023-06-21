import { SetStateAction, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { fetchAuthMe, selectIsAuth } from '../../redux/slices/auth';
import { fetchUsers } from '../../redux/slices/users';

import { Loader, PeopleList } from '../../components';

import { Box, Container, InputAdornment, Tab, Tabs, TextField } from '@mui/material';
import { Search } from '@mui/icons-material';

import { isDataLoading } from '../../utils/data';

import { UserData } from '../../types/UserData';

// TODO - [WORK] - too much re-renders - optimize
export const Friends = () => {
  const [tabValue, setTabValue] = useState<string>('friends');
  const [searchReq, setSearchReq] = useState<string>('');
  const [actionWithFriendId, setActionWithFriendId] = useState<string>();

  const {id} = useParams();
  const useQuery = () => new URLSearchParams(useLocation().search);
  const query = useQuery();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuth = useSelector(selectIsAuth);
  const authUserData = useSelector((state: { auth: { data: UserData } }) => state.auth.data);
  const users = useSelector((state: { users: { users: UserData[] } }) => state.users.users);

  const isUsersDataLoading = isDataLoading(users);
  const isAuthDataLoading = isDataLoading(authUserData);

  if (!window.localStorage.getItem('token') && !isAuth) {
    navigate('/login');
  }

  const areMyFriends = (!isAuthDataLoading && !isUsersDataLoading) && id === authUserData?._id;

  const section = query.get('section');
  const act = query.get('act');

  useEffect(() => {
    dispatch(fetchAuthMe());
  }, [actionWithFriendId]);

  useEffect(() => {
    dispatch(fetchUsers({id, section, act}));
  }, [section, act, actionWithFriendId]);

  useEffect(() => {
    switch (tabValue) {
      case 'friends':
        navigate(`/user/${id}/friends`);
        break;
      case 'requests':
        navigate(`/user/${authUserData?._id}/friends?section=all_requests`);
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

  const peopleListUpdateData = (value: string): void => {
    setActionWithFriendId(value);
  };

  return (
      isUsersDataLoading || isAuthDataLoading
          ? <Loader />
          : <>
            <Container
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  padding: '15px'
                }}
            >
              <PeopleList searchReq={searchReq} peopleListUpdateData={peopleListUpdateData}
                          section={section} usersData={users} areMyFriends={areMyFriends} authData={authUserData} />
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
