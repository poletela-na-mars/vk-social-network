import { Container, Typography, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';

export const Header = () => {
  const theme = useTheme();

  return (
      <Container sx={{height: '60px', padding: '15px'}}>
        <Link to='/' style={{textDecoration: 'none'}}>
          <Typography display='inline' component='h1' variant='h1' color={theme.palette.primary.main}>
            Network
          </Typography>
        </Link>
      </Container>
  );
};