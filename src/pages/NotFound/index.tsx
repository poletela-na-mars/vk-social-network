import { Box, Typography } from '@mui/material';
import styles from './NotFound.module.scss';

export const NotFound = () => {
  return (
      <Box className={styles.notFound}>
        <img
            className={styles.notFoundImg}
            // style={{maxWidth: '330px', maxHeight: '330px', objectFit: 'contain'}}
            src='/not-found.png'
            alt='Not found page'
        />
        <Typography className={styles.notFoundH} variant='h2' component='h2'>
          404<br />
          Страница не найдена
        </Typography>
        <Typography className={styles.notFoundP} variant='h5' component='p'>
          Страница, на которую вы попали, не существует.<br />Проверьте правильность
          введенного адреса.
        </Typography>
      </Box>
  );
};