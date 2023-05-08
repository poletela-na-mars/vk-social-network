import { useEffect, useState } from 'react';
import { fetchUsers, selectIsAuth } from '../../redux/slices/auth';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Tab, Tabs, Typography } from '@mui/material';
import { Loader } from '../../components';

export const Friends = () => {
  const [usersData, setUsersData] = useState<any>();

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

  return (
      isUsersDataLoading
          ? <Loader />
          : <>
            <Tabs style={{ marginBottom: 15 }} value={tabValue} onChange={handleTabValueChange} aria-label='tabs'>
              <Tab label='Друзья' />
              <Tab label='Все люди' />
              <Tab label='По тегам' disabled={true} />
            </Tabs>
            {usersData?.map((user: any) => <Typography>{user?.firstName}</Typography>)}
          </>
  );
};
