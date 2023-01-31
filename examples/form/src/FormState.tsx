import * as React from 'react';
import { useFormState } from './index';
import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

function LinearProgressWithButton(props: any) {
    const { loading, handleButtonClick, color, message, type } = props;
    return (
        <Box sx={{ m: 1, position: 'relative' }}>
            <Button
                variant="contained"
                disabled={loading}
                onClick={handleButtonClick}
                color={color}
                type={type}
            >
                {message}
            </Button>
            {loading && (
                <CircularProgress
                    size={24}
                    color={color}
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        marginTop: '-12px',
                        marginLeft: '-12px',
                    }}
                />
            )}
        </Box>
    );
}

export const FormState: React.FC<any> = ({ data }) => {
    const { errors, isSubmitting, isValidating } = useFormState();
    const liErrors = errors ? (
        (errors as any[]).map((error) => (
            <Alert key={'alert' + error.key} severity="error">
                {error.label + ': ' + error.error}
            </Alert>
        ))
    ) : (
        <></>
    );
    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    columnGap: 1,
                    padding: 2,
                }}
            >
                <Button variant="contained" color="error" onClick={data.reset}>
                    reset
                </Button>
                <LinearProgressWithButton
                    handleButtonClick={data.validate}
                    loading={isValidating}
                    message="Validate"
                    color="secondary"
                />
                <LinearProgressWithButton
                    handleButtonClick={data.submit}
                    loading={isSubmitting}
                    message="Submit"
                    color="primary"
                    type="submit"
                />
            </Box>
            <Card>
                <div>{liErrors}</div>
            </Card>
        </>
    );
};
