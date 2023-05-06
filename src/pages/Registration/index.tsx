import { SyntheticEvent } from 'react';
import { useFormik } from 'formik';
import { registrationValidationSchema } from './registrationValidationSchema';
import { Autocomplete, Box, Button, Container, TextField, Typography, useTheme } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider, ruRU } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { cities } from '../../data/russianCities';
import { Link } from 'react-router-dom';

export const Registration = () => {
  const theme = useTheme();

  const {touched, errors, isSubmitting, handleSubmit, handleChange, values, setFieldValue} = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      city: '',
      birthday: '',
      uniOrJob: '',
      password: '',
      email: '',
    },
    enableReinitialize: true,
    validateOnChange: true,
    validationSchema: registrationValidationSchema,
    onSubmit: (values: object) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  const handleCityChange = (event: SyntheticEvent<Element, Event>, value: string | null) => {
    setFieldValue('city', value);
  };

  // TODO - [BUG] - a bug in MUI with error focusing in Date Picker after another input interaction

  return (
      <Box
          sx={{
            height: 'calculate(100vh - 60px)',
            display: 'grid',
            gap: 1,
            gridTemplate: '1fr 10fr 1fr /  2fr 8fr 2fr',
          }}
      >
        <Box sx={{gridArea: '2 / 2 / 2 / 2'}}>
          <Container maxWidth='sm'>
            <Typography component='h2' variant='h2' fontSize={18} align='center'>
              Заполните поля, чтобы зарегистрироваться
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
              <Box sx={{display: 'flex', justifyContent: 'space-between', margin: '0 0 16px 0'}}>
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
                    sx={{marginRight: '8px'}}
                    autoComplete='on'
                />
                <LocalizationProvider localeText={ruRU.components.MuiLocalizationProvider.defaultProps.localeText}
                                      dateAdapter={AdapterDayjs}>
                  <DatePicker
                      disableFuture
                      localeText={ruRU.components.MuiLocalizationProvider.defaultProps.localeText}
                      format='DD-MM-YYYY'
                      label='Дата рождения'
                      value={values.birthday}
                      onChange={(value) => setFieldValue('birthday', value, true)}
                      slotProps={{
                        textField: {
                          required: true,
                          variant: 'outlined',
                          error: Boolean(errors.birthday),
                          helperText: touched.birthday && errors.birthday
                        }
                      }}
                      sx={{width: '80%'}}
                  />
                </LocalizationProvider>
              </Box>
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
              <TextField
                  required
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
                  sx={{marginBottom: '16px'}}
                  autoComplete='on'
              />
              <TextField
                  required
                  fullWidth
                  inputProps={{maxLength: 50}}
                  placeholder='Ваш супер секретный пароль...'
                  label='Пароль'
                  id='password'
                  name='password'
                  type={'password'}
                  value={values.password}
                  onChange={handleChange}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  sx={{marginBottom: '16px'}}
                  autoComplete='off'
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
                <Link to='/login' style={{textDecoration: 'none'}}>
                  <Typography display='inline'
                              component='p'
                              color='lightgray'
                              sx={{
                                marginRight: '16px',
                                '&:hover': {color: theme.palette.primary.main}
                              }}
                  >
                    Есть аккаунт?
                  </Typography>
                </Link>
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
                  Зарегистрироваться
                </Button>
              </Container>
            </form>
          </Container>
        </Box>
      </Box>
  );
};