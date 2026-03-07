import React from 'react';
import { Dialog, DialogContent, DialogActions, Box, Typography, Button, Slide } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

const CustomModal = ({ open, handleClose, severity, message, isConfirm, onConfirm, title }) => {
    const isError = severity === 'error';
    const isWarning = severity === 'warning';

    const getIcon = () => {
        if (isError) return <ErrorOutlineIcon sx={{ fontSize: 64, color: '#d32f2f', mb: 2 }} />;
        if (isWarning) return <WarningAmberIcon sx={{ fontSize: 64, color: '#ed6c02', mb: 2 }} />;
        return <CheckCircleOutlineIcon sx={{ fontSize: 64, color: '#2e7d32', mb: 2 }} />;
    };

    const displayTitle = () => {
        if (title === null) return null; // Explicitly hidden
        if (title) return title;        // Custom string

        // Fallback to defaults
        if (isError) return 'Oops! Something went wrong';
        if (isWarning) return 'Are you sure?';
        return 'Success!';
    };

    const getBtnColor = () => {
        if (isError) return 'error';
        if (isWarning) return 'warning';
        return 'success';
    };

    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    p: 2,
                    minWidth: '350px',
                    textAlign: 'center',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                }
            }}
        >
            <DialogContent>
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                    {getIcon()}
                    {displayTitle() && (
                        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: '#333' }}>
                            {displayTitle()}
                        </Typography>
                    )}
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 1, whiteSpace: 'pre-line' }}>
                        {message}
                    </Typography>
                </Box>
            </DialogContent>

            <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
                {isConfirm ? (
                    <>
                        <Button
                            onClick={handleClose}
                            variant="outlined"
                            color="inherit"
                            sx={{ borderRadius: 2, textTransform: 'none', minWidth: '100px', fontWeight: 600, mr: 1 }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={() => { onConfirm && onConfirm(); handleClose(); }}
                            variant="contained"
                            color={getBtnColor()}
                            disableElevation
                            sx={{ borderRadius: 2, textTransform: 'none', minWidth: '100px', fontWeight: 600 }}
                        >
                            Yes, Confirm
                        </Button>
                    </>
                ) : (
                    <Button
                        onClick={handleClose}
                        variant="contained"
                        color={getBtnColor()}
                        disableElevation
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            minWidth: '120px',
                            fontWeight: 600
                        }}
                    >
                        Ok, Got it!
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default CustomModal;
