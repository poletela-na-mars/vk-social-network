import { useState } from 'react';
import { useFormik } from 'formik';
import { loginValidationSchema } from './loginValidationSchema';

import { Box, Button, Container, IconButton, InputAdornment, TextField, Typography, useTheme } from '@mui/material';
import { VisibilityOff, Visibility } from '@mui/icons-material';

export const Login = () => {
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  // const isAuth = useSelector(selectIsAuth);
  // const dispatch = useDispatch();
  //

  const theme = useTheme();

  const {touched, errors, isSubmitting, handleSubmit, handleChange, values} = useFormik({
    initialValues: {
      password: '',
      email: '',
    },
    enableReinitialize: true,
    validateOnChange: true,
    validationSchema: loginValidationSchema,
    onSubmit: (values: object) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  // const onSubmit = async (values) => {
  //   try {
  //     setIsSubmitting((prevState) => !prevState);
  //     const data = await dispatch(fetchAuth(values));
  //     setIsSubmitting((prevState) => !prevState);
  //
  //     if (data.meta.requestStatus === 'rejected') {
  //       await Promise.reject(data.error.message);
  //     } else if ('token' in data?.payload) {
  //       window.localStorage.setItem('token', data.payload.token);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //     setError('LoginError', { type: 'custom', message: err });
  //   }
  // };

  // if (isAuth) {
  //   return <Navigate to='/' />;
  // }

  const handlePasswordVisibilityClick = () => {
    setPasswordVisibility(!passwordVisibility);
  };

  return (
      <Box
          sx={{
            height: 'calculate(100vh - 60px)',
            display: 'grid',
            gap: 1,
            gridTemplate: '2fr 8fr 2fr /  2fr 8fr 2fr',
          }}
      >
        <Box sx={{gridArea: '2 / 2 / 2 / 2'}}>
          <Container maxWidth='sm'>
            <Typography component='h2' variant='h2' fontSize={18} align='center'>
              Введите e-mail и пароль, чтобы войти
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                  fullWidth
                  inputProps={{maxLength: 50}}
                  placeholder='email@email.ru'
                  label='E-mail'
                  id='email'
                  name='email'
                  value={values.email}
                  onChange={handleChange}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  sx={{margin: '16px 0'}}
              />
              <TextField
                  fullWidth
                  inputProps={{maxLength: 50}}
                  placeholder='Ваш супер секретный пароль...'
                  label='Пароль'
                  id='password'
                  name='password'
                  type={passwordVisibility ? 'text' : 'password'}
                  value={values.password}
                  onChange={handleChange}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  sx={{marginBottom: '16px'}}
                  InputProps={{
                    endAdornment:
                        <InputAdornment position='end' sx={{marginRight: 1}}>
                          <IconButton
                              onClick={handlePasswordVisibilityClick}
                              edge='end'
                          >
                            {passwordVisibility ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                  }}
              />
              <Container
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    padding: 0,
                  }}
              >
                <Button
                    style={{
                      backgroundColor: theme.palette.primary.main,
                      textTransform: 'none',
                      fontSize: '16px',
                    }}
                    variant='contained'
                    size='medium'
                    type='submit'
                    disabled={isSubmitting}
                >
                  Войти
                </Button>
              </Container>
            </form>
          </Container>
        </Box>
      </Box>
  );
};