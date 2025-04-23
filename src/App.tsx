import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { AppRoutes } from '@/routes';
import { Toaster } from 'sonner';
import ErrorBoundary from '@/components/error-boundary';

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
