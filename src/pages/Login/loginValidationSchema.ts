import * as yup from 'yup';

export const loginValidationSchema = yup.object({
  password: yup
      .string().matches(
          /^(?=.*[A-ZЁА-Я].*[A-ZЁёА-Я])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-zёа-я].*[a-zёа-я].*[a-zёа-я]).{8,}$/,
          'Пароль должен содержать как минимум 2 заглавные буквы и 3 прописные, 1 спец. символ (!@#$&*), 2 цифры (0-9))')
      .required('Укажите пароль'),
  email: yup
      .string()
      .email('Некорректный e-mail')
      .required('Укажите ваш e-mail'),
});