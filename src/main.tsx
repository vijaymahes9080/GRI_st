import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { ThemeProvider } from './core/theme/ThemeContext';
import { WebErrorBoundary } from './components/common/WebErrorBoundary';
import { initGlobalErrorHandlers } from './core/services/globalErrorHandler';
import './global.css';

// Initialize global unhandled rejection & script error guards
initGlobalErrorHandlers();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WebErrorBoundary fallbackTitle="Gandhigram Rural Institute Portal">
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </WebErrorBoundary>
  </React.StrictMode>
);


