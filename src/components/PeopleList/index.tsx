import axios from '../../axios';
import { Box, Button, Container, Tab, Tabs, Typography } from '@mui/material';
import { convertDateToAge } from '../../utils/date';
import React, { SetStateAction, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { UserData } from '../../types/UserData';
import { PeopleListProps } from '../../types/PeopleListProps';
import { ADD_FRIEND, ALL_REQUESTS, DELETE_FRIEND_OR_REQ, OUT_REQUESTS } from '../../data/consts';

import styles from '../../pages/Friends/Friends.module.scss';

export const PeopleList = (props: PeopleListProps) => {
  const navigate = useNavigate();
  const [requestTabValue, setRequestTabValue] = useState('all_requests');
  const [usersDataToShow, setUsersDataToShow] = useState<UserData[] | undefined>();

  useEffect(() => {
    if (props.areMyFriends && props.section) {
      switch (requestTabValue) {
        case ALL_REQUESTS:
          navigate(`/user/${props.authData?._id}/friends?section=${ALL_REQUESTS}`);
          break;
        case OUT_REQUESTS:
          navigate(`/user/${props.authData?._id}/friends?section=${OUT_REQUESTS}`);
          break;
      }
    }
  }, [requestTabValue]);

  useEffect(() => {
    if (props.searchReq) {
      const data: SetStateAction<UserData[] | undefined> = props.usersData?.filter((user) => {
        return user.firstName.toLowerCase().includes(props.searchReq.toLowerCase()) ||
            user.lastName.toLowerCase().includes(props.searchReq.toLowerCase());
      });
      setUsersDataToShow(data);
    } else {
      setUsersDataToShow(props.usersData);
    }
  }, [props.searchReq, props.usersData]);

  const handleReqTabValueChange = (event: React.SyntheticEvent, value: React.SetStateAction<string>) => {
    setRequestTabValue(value);
  };

  const isMyFriend = (friendId: string) => {
    return props.authData?.friends.includes(friendId as never);
  };

  const isReqSent = (friendId: string) => {
    return props.authData?.outFriendsReq.includes(friendId as never);
  };

  const handleAddReqOrDeleteFriendButtonClick = async (friendId: string) => {
    try {
      let action;
      if (isMyFriend(friendId) || isReqSent(friendId)) {
        await axios.delete(`/user/${props.authData?._id}/friend/${friendId}`);
        action = DELETE_FRIEND_OR_REQ;
      } else {
        await axios.put(`/user/${props.authData?._id}/friend/${friendId}`);
        action = ADD_FRIEND;
      }
      props.peopleListUpdateData(action);
    } catch (err) {
      console.error(err);
    }
  };

  return (
      <Box sx={{display: 'flex', flexDirection: 'column', marginRight: '16px'}}>
        <>
          {props.section &&
              <Tabs value={requestTabValue} onChange={handleReqTabValueChange} style={{marginBottom: 15}}
                    aria-label='tabs'>
                <Tab value={ALL_REQUESTS} label='Входящие' />
                <Tab value={OUT_REQUESTS} label='Исходящие' />
              </Tabs>
          }
          {
            props.usersData?.length === 0
                ? <Typography align='center' sx={{margin: '16px 0'}} color='lightgray'>Список пуст</Typography>
                :
                usersDataToShow?.map((user: UserData) =>
                    <Container
                        key={user._id}
                        disableGutters
                        sx={{
                          display: 'flex',
                          justifyContent: 'flex-start',
                          alignItems: 'center',
                          marginBottom: '16px',
                        }}
                    >
                      <img className={styles.avatar} src={user?.avatarUrl || '/default-avatar.png'}
                           alt={`${user?.firstName} ${user?.lastName}`} />
                      <Link to={`/user/${user?._id}`} className={styles.profileLink} style={{color: 'black'}}>
                        <Typography>
                          {`${user?.firstName} ${user?.lastName}, ${convertDateToAge(user?.birthday)}`}
                        </Typography>
                      </Link>
                      {props.areMyFriends &&
                          <Button onClick={() => handleAddReqOrDeleteFriendButtonClick(user?._id)} variant='outlined'
                                  style={{textTransform: 'none', marginLeft: '16px'}} size='small'>
                            {isMyFriend(user?._id) ? 'Удалить из друзей' :
                                (isReqSent(user?._id) ? 'Отменить заявку' : 'Добавить в друзья')}
                          </Button>}
                    </Container>
                )
          }
        </>
      </Box>
  );
};