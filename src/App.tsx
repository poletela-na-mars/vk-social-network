import { Route, Routes } from 'react-router-dom';

import { Header } from './components';
import { Login, Registration, NotFound  } from './pages';

import { ThemeProvider } from '@mui/material';
import { theme } from './theme';

const App = () => {
  return (
      <ThemeProvider theme={theme}>
        <Header/>
        <Routes>
          <Route path='*' element={<NotFound />} />
          <Route path='/' element={<Login  />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Registration />} />
        </Routes>
      </ThemeProvider>
  );
};

export default App;
