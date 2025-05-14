import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { AppRoutes } from '@/routes';
import ErrorBoundary from '@/components/error-boundary';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <BrowserRouter>
          <AppRoutes />
          <Toaster />
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
