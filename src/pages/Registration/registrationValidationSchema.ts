import { loginValidationSchema } from '../Login/loginValidationSchema';
import { profileEditValidationSchema } from '../ProfileEdit/profileEditValidationSchema';

export const registrationValidationSchema = loginValidationSchema.shape({
  ...profileEditValidationSchema.fields,
});
