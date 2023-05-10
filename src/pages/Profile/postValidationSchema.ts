import * as yup from 'yup';

//TODO - [SECURITY] - Sanitize post text (+ on back-end)

export const postValidationSchema = yup.object({
  text: yup
      .string()
      .min(1, 'Пост должен содержать, как минимум, 1 символ')
      .max(1000, 'Пост не должен содержать больше 1000 символов')
      .required('Пост не должен быть пустым'),
});