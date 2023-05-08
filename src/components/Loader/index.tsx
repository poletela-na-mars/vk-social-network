import { Box, CircularProgress } from '@mui/material';

export const Loader = () => {
  return (
      <Box
          sx={{
            display: 'flex',
            height: 'calc(100vh - 60px)',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
        <CircularProgress />
      </Box>
  )
};
