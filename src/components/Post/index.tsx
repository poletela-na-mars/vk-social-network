import { Box, Button, Container, Typography } from '@mui/material';
import styles from '../../pages/Profile/Profile.module.scss';
import { Link } from 'react-router-dom';
import { formatDateWithTime } from '../../utils/date';
import FavoriteIcon from '@mui/icons-material/Favorite';
import React, { SetStateAction, useEffect, useState } from 'react';
import { fetchPost } from '../../redux/slices/posts';
import { UserData } from '../../types/UserData';
import { PostType } from '../../types/PostType';
import { useDispatch } from 'react-redux';
import { fetchUser } from '../../redux/slices/users';
import axios from '../../axios';
import { Loader } from '../Loader';

interface PostProps {
  postId: string;
}

export const Post = (props: PostProps) => {
  const dispatch = useDispatch();
  const [post, setPost] = useState<PostType | undefined>();
  const [user, setUser] = useState<UserData | undefined>();
  const [like, setLike] = useState<boolean>(false);

  const isDataLoading = post === undefined || user === undefined;

  const postId = props.postId;

  useEffect(() => {
    dispatch(fetchPost({postId}))
        .then((res: { payload: SetStateAction<PostType | undefined>; }) => setPost(res.payload));
    dispatch(fetchUser({postId}))
        .then((res: { payload: SetStateAction<UserData | undefined>; }) => setUser(res.payload));
  }, [like]);

  const handleLikeClick = async (postId: string | undefined) => {
    await axios.patch(`/posts/${postId}`);
    setLike(!like);
  };

  return (
      isDataLoading
          ? <Loader />
          :
          <Box key={props.postId} sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start'
          }}>
            <Container disableGutters
                       sx={{display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
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
                <Typography color='lightgray'>{formatDateWithTime(post?.createdAt)}</Typography>
              </Box>
            </Container>
            <Container disableGutters sx={{margin: '16px 0'}}>
              <Typography>{post?.text}</Typography>
            </Container>
            <Button
                variant='outlined'
                endIcon={<FavoriteIcon />}
                onClick={() => handleLikeClick(post?._id)}
            >
              {post?.likes.length}
            </Button>
          </Box>
  );
};
