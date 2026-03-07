import React from 'react';
import { Box, Typography } from '@mui/material';

const FooterBlack = () => {
    return (
        <Box sx={{
            bgcolor: '#000000',
            color: '#ffffff',
            py: 3,
            textAlign: 'center',
            mt: 'auto', // Pushes footer to bottom if flex container
            width: '100%',
            position: 'relative',
            zIndex: 10
        }}>
            <Typography variant="body2" sx={{ fontFamily: 'Inter, sans-serif' }}>
                &copy; copyright 2026.
            </Typography>
        </Box>
    );
};

export default FooterBlack;
