import { Container, Typography, useTheme } from '@mui/material';

export const Header = () => {
  const theme = useTheme();

  return (
      <Container sx={{height: '60px', padding: '15px'}}>
        <Typography component='h1' variant='h1' color={theme.palette.primary.main}>
          Network
        </Typography>
      </Container>
  );
};