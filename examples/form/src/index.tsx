/* eslint-disable import/first */
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

//import App from './AppNoDeps';
//export { useFormSetValue, useFormSubmit, useFormState, useFormValue } from './AppNoDeps';
//import App from './AppReactRelayForms';
//export { useFormSetValue, useFormSubmit, useFormState, useFormValue } from './AppReactRelayForms';
import App from './AppRelayForms';
export { useFormSetValue, useFormSubmit, useFormState, useFormValue } from './AppRelayForms';
// eslint-disable-next-line import/first
import * as serviceWorker from './serviceWorker';

import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { Box, Container, CssBaseline, Typography } from '@material-ui/core';

const theme = createTheme();

ReactDOM.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <Container component="main" style={{ maxWidth: 750 }} maxWidth={false}>
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
