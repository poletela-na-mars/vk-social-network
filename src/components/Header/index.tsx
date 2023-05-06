import { Button, Container, Typography, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectIsAuth } from '../../redux/slices/auth';

export const Header = () => {
  const theme = useTheme();

  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);

  const handleLogoutButtonClick = () => {
    dispatch(logout());
    window.localStorage.removeItem('token');
  };

  return (
      <Container sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '60px', padding: '15px'}}>
        <Link to='/' style={{textDecoration: 'none'}}>
          <Typography display='inline' component='h1' variant='h1' color={theme.palette.primary.main}>
            Network
          </Typography>
        </Link>
        {
            isAuth &&
            <Button onClick={handleLogoutButtonClick} variant='outlined'>
              Выйти
            </Button>
        }
      </Container>
  );
};