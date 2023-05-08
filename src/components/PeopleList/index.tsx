import { Box, Button, Container, Tab, Tabs, Typography } from '@mui/material';
import styles from '../../pages/Friends/Friends.module.scss';
import { convertDateToAge } from '../../utils/date';
import React, { useState } from 'react';

import { UserData } from '../../types/UserData';

interface PeopleListProps {
  section: string | null;
  usersData: UserData[] | undefined;
  areMyFriends: boolean;
}

export const PeopleList = (props: PeopleListProps) => {
  const [requestTabValue, setRequestTabValue] = useState(0);

  const handleReqTabValueChange = (event: React.SyntheticEvent, value: number) => {
    setRequestTabValue(value);
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
                  <Typography>
                    {`${user?.firstName} ${user?.lastName}, ${convertDateToAge(
                        user?.birthday)}`}
                  </Typography>
                  {props.areMyFriends &&
                      <Button variant='outlined' style={{textTransform: 'none', marginLeft: '16px'}} size='small'>
                        Добавить в друзья/Удалить
                      </Button>}
                </Container>
            )
          }
        </>
      </Box>
  );
};