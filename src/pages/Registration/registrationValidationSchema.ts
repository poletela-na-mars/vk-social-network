import { loginValidationSchema } from '../Login/loginValidationSchema';
import * as yup from 'yup';

export const registrationValidationSchema = loginValidationSchema.shape({
  firstName: yup
      .string()
      .matches(/^[A-zёЁА-я ]+$/, {message: 'Некорректное имя'})
      .min(2, 'Слишком короткое имя')
      .max(30, 'Слишком длинное имя')
      .required('Укажите ваше имя'),
  lastName: yup
      .string()
      .matches(/^[A-zёЁА-я ]+$/, {message: 'Некорректная фамилия'})
      .min(2, 'Слишком короткая фамилия')
      .max(50, 'Слишком длинная фамилия')
      .required('Укажите вашу фамилию'),
  birthday: yup
      .date()
      .required('Укажите дату рождения'),
  uniOrJob: yup
      .string(),
});