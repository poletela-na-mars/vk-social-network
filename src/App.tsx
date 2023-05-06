import { Route, Routes } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchAuthMe } from './redux/slices/auth';

import { Header } from './components';
import { Login, Registration, NotFound  } from './pages';

import { ThemeProvider } from '@mui/material';
import { theme } from './theme';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAuthMe());
  }, [dispatch]);

  return (
      <ThemeProvider theme={theme}>
        <Header/>
        <Routes>
          <Route path='*' element={<NotFound />} />
          <Route path='/' element={<NotFound />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Registration />} />
        </Routes>
      </ThemeProvider>
  );
};

export default App;
