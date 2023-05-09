import { Box, Button, Container, Tab, Tabs, Typography } from '@mui/material';
import { convertDateToAge } from '../../utils/date';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import styles from '../../pages/Friends/Friends.module.scss';

import { UserData } from '../../types/UserData';
import axios from '../../axios';

interface PeopleListProps {
  section: string | null;
  usersData: UserData[] | undefined;
  areMyFriends: boolean;
  authDataId: string | undefined;
}

export const PeopleList = (props: PeopleListProps) => {
  const [requestTabValue, setRequestTabValue] = useState(0);

  const handleReqTabValueChange = (event: React.SyntheticEvent, value: number) => {
    setRequestTabValue(value);
  };

  const handleAddReqOrDeleteFriendButtonClick = async (friendId: string | undefined) => {
    try {
      await axios.put(`/user/${props.authDataId}/friend/${friendId}`);
      //TODO - add query - add request or delete friend
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
                <Tab label='Входящие' />
                <Tab label='Исходящие' />
              </Tabs>
          }
          {
            props.usersData?.map((user: UserData) =>
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
                      {`${user?.firstName} ${user?.lastName}, ${convertDateToAge(
                          user?.birthday)}`}
                    </Typography>
                  </Link>
                  {props.areMyFriends &&
                      <Button onClick={() => handleAddReqOrDeleteFriendButtonClick(user?._id)} variant='outlined' style={{textTransform: 'none', marginLeft: '16px'}} size='small'>
                        Добавить в друзья/Удалить
                      </Button>}
                </Container>
            )
          }
        </>
      </Box>
  );
};