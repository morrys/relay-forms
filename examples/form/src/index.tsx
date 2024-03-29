/* eslint-disable import/first */
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

//import App from './AppNoDeps';
//export { useFormField, useForm, useFormState, useFormValue } from './AppNoDeps';
//import App from './AppReactRelayForms';
//export { useFormField, useForm, useFormState, useFormValue } from './AppReactRelayForms';
import App from './AppRelayForms';
export { useFormField, useForm, useFormState, useFormValue } from './AppRelayForms';
// eslint-disable-next-line import/first
import * as serviceWorker from './serviceWorker';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, Container, CssBaseline } from '@mui/material';

export const DELAY = {
    submit: 1,
    validate: 1,
};

const theme = createTheme();

ReactDOM.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <Container component="main" style={{ maxWidth: 750, paddingTop: 30 }} maxWidth={false}>
                <CssBaseline />

                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <App />
                </Box>
            </Container>
        </ThemeProvider>
    </React.StrictMode>,
    document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
