import styles from '../../pages/Feed/Feed.module.scss';
import { Link } from 'react-router-dom';
import { Container } from '@mui/material';

import { UserData } from '../../types/UserData';

interface CurrentUserHeaderProps {
  authData: UserData;
}

export const CurrentUserHeader = (props: CurrentUserHeaderProps) => {
  return (
      <Container sx={{display: 'flex', justifyContent: 'flex-start', alignItems: 'center', margin: '16px 0'}}
                 disableGutters>
        <img className={styles.avatar}
             src={props.authData?.avatarUrl ? `${process.env.REACT_APP_API_URL}${props.authData?.avatarUrl}` :
                 '/default-avatar.png'}
             alt={`${props.authData?.firstName} ${props.authData?.lastName}`} />
        <Link to={`/user/${props.authData?._id}`} className={styles.profileLink}
              style={{color: 'black', marginLeft: '8px', fontWeight: 'bold'}}>
          {`${props.authData?.firstName} ${props.authData?.lastName}`}
        </Link>
      </Container>
  );
};
