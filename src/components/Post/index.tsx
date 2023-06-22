import axios from '../../axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';

import { Box, Button, Container, Typography } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import styles from '../../pages/Profile/Profile.module.scss';

import { Skeleton } from './Skeleton';

import { formatDateWithTime } from '../../utils/date';
import { isDataLoading } from '../../utils/data';

import { UserData } from '../../types/UserData';
import { PostType } from '../../types/PostType';

export const Post = (props: PostType) => {
  const {ref, inView} = useInView({
    threshold: 0.5,
    triggerOnce: true
  });

  const [likes, setLikes] = useState<number>(props.likes.length);
  const [user, setUser] = useState<UserData | undefined>(undefined);

  const isUserLoading = isDataLoading(user);

  const userId = props.user;

  useEffect(() => {
    axios.get(`/user/${userId}`)
        .then((res) => {
          setUser(res.data);
        })
        .catch((err) => {
          console.error(err.response.data);
        });
  }, []);

  const handleLikeClick = (postId: string) => {
    axios.patch(`/posts/${postId}`)
        .then((res) => {
          setLikes(res.data.likes.length);
        })
        .catch((err) => {
          console.error(err.response.data);
        });
  };

  return (
      <Box ref={ref} sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        margin: '16px 0',
      }}>
        {inView && !isUserLoading
            ?
            <>
              <Container disableGutters sx={{display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                <img className={styles.avatarOnWall}
                     src={user?.avatarUrl ? `${process.env.REACT_APP_API_URL}${user?.avatarUrl}` :
                         '/default-avatar.png'}
                     alt={`${user?.firstName} ${user?.lastName}`} />
                <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'flex-start',
                      marginLeft: '8px'
                    }}
                >
                  <Link to={`/user/${user?._id}`} className={styles.profileLink}
                        style={{color: 'black', fontWeight: 'bold', marginBottom: '8px'}}>
                    {`${user?.firstName} ${user?.lastName}`}
                  </Link>
                  <Typography color='lightgray'>{formatDateWithTime(props.createdAt)}</Typography>
                </Box>
              </Container>
              <Container disableGutters sx={{margin: '16px 0'}}>
                <Typography>{props.text}</Typography>
              </Container>
              <Button
                  variant='outlined'
                  endIcon={<FavoriteIcon />}
                  onClick={() => handleLikeClick(props._id)}
              >
                {likes}
              </Button>
            </>
            :
            <Skeleton key={props._id} />
        }
      </Box>
  );
};
