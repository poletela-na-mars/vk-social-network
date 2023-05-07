import { useFormik } from 'formik';
import { SyntheticEvent, useEffect } from 'react';
import { selectIsAuth } from '../../redux/slices/auth';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { profileEditValidationSchema } from './profileEditValidationSchema';

import { Autocomplete, Box, Button, CircularProgress, Container, TextField, Typography, useTheme } from '@mui/material';
import { NotFound } from '../NotFound';

import { cities } from '../../data/russianCities';
import axios from '../../axios';

export const ProfileEdit = () => {
  const theme = useTheme();

  const {id} = useParams();
  const isAuth = useSelector(selectIsAuth);
  const navigate = useNavigate();
  const userData = useSelector((state: any) => state.auth.data);
  const isUserDataLoading = userData === undefined || userData === null;

  const {touched, errors, isSubmitting, handleSubmit, handleChange, values, setFieldValue} = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      city: '',
      birthday: '',
      uniOrJob: '',
      avatarUrl: '',
    },
    enableReinitialize: true,
    validateOnChange: true,
    validationSchema: profileEditValidationSchema,
    onSubmit: async (values: object) => {
      try {
        await axios.patch(`/user/${id}`, values);
        navigate(`/user/${id}`);
      } catch (err) {
        console.error(err);
      }
    },
  });

  useEffect(() => {
    if (!isUserDataLoading) {
      setFieldValue('firstName', userData?.firstName);
      setFieldValue('lastName', userData?.lastName);
      setFieldValue('city', userData?.city);
      setFieldValue('uniOrJob', userData?.uniOrJob);
      setFieldValue('avatarUrl', userData?.avatarUrl);
    }
  }, [isUserDataLoading]);

  if (!window.localStorage.getItem('token') && !isAuth) {
    navigate('/login');
  }

  if (!isUserDataLoading && id !== userData?._id) {
    return <NotFound />
  }

  const handleCityChange = (event: SyntheticEvent<Element, Event>, value: string | null) => {
    setFieldValue('city', value);
  };

  return (
      <Container maxWidth='lg'>
        {isUserDataLoading
            ?
            <Box
                sx={{
                  display: 'flex',
                  height: 'calc(100vh - 60px)',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
              <CircularProgress />
            </Box>
            :
            <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  margin: '32px 0',
                }}
            >
              <Typography component='h2' variant='h2' fontSize={18} align='center'>
                Редактирование профиля
              </Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                    required
                    fullWidth
                    inputProps={{maxLength: 50}}
                    placeholder='Иванов'
                    label='Фамилия'
                    id='lastName'
                    name='lastName'
                    value={values.lastName}
                    onChange={handleChange}
                    error={touched.lastName && Boolean(errors.lastName)}
                    helperText={touched.lastName && errors.lastName}
                    sx={{margin: '16px 0'}}
                    autoComplete='on'
                />
                <TextField
                    required
                    fullWidth
                    inputProps={{maxLength: 30}}
                    placeholder='Иван'
                    label='Имя'
                    id='firstName'
                    name='firstName'
                    value={values.firstName}
                    onChange={handleChange}
                    error={touched.firstName && Boolean(errors.firstName)}
                    helperText={touched.firstName && errors.firstName}
                    sx={{marginBottom: '16px'}}
                    autoComplete='on'
                />
                <Autocomplete
                    id='city'
                    options={cities}
                    fullWidth
                    value={values.city}
                    renderInput={(params) => <TextField {...params} label='Город' />}
                    onChange={(event, value) => handleCityChange(event, value)}
                    sx={{marginBottom: '16px'}}
                />
                <TextField
                    fullWidth
                    inputProps={{maxLength: 50}}
                    placeholder='Санкт-Петербургский политехнический университет Петра Великого'
                    label='Вуз/Место работы'
                    id='uniOrJob'
                    name='uniOrJob'
                    value={values.uniOrJob}
                    onChange={handleChange}
                    error={touched.uniOrJob && Boolean(errors.uniOrJob)}
                    helperText={touched.uniOrJob && errors.uniOrJob}
                    sx={{marginBottom: '16px'}}
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
                    Сохранить изменения
                  </Button>
                </Container>
              </form>
            </Box>
        }
      </Container>
  );
};
