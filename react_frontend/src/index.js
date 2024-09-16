import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import { ConfigProvider } from 'antd';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
    typography: {
      fontFamily: "SUITE-Regular", // 원하는 폰트로 변경
    },
});
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ConfigProvider 
        theme={{ 
            hashed: false,
            fontFamily: "SUITE-Regular", 
        }}
    >
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
        </ThemeProvider>
    </ConfigProvider>
);

