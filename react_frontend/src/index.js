import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import { ConfigProvider } from 'antd';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ConfigProvider 
        theme={{ 
            hashed: false,
            fontFamily: "SUITE-Regular", 
        }}
    >
        <App />
    </ConfigProvider>
);

