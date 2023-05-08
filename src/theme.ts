import { createTheme } from '@mui/material';

export const theme = createTheme({
  typography: {
    fontFamily: [
      'Roboto',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 'bold',
      fontSize: '24px',
    },
    h2: {
      fontWeight: 'bold',
      fontSize: '22px',
    },
    h5: {
      fontWeight: 'normal',
      fontSize: '16px',
    },
    button: {
      fontWeight: 'bold',
    },
  },
  shape: {
    borderRadius: 50,
  },
  palette: {
    primary: {
      // light: '#0033FF',
      main: '#3366FF',
      // dark: '#F5F5F5',
    },
  }
});