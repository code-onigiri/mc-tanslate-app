import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from '@react-router';
import router from './routes';
import './app.css';
import { initializeTheme, setupThemeListener } from './util/themeUtils';

// 初期テーマを設定
initializeTheme();
setupThemeListener();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
