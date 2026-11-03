import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProvider } from './app-state.js';
import { PublicApp } from './public.js';
import { ErpApp } from './erp.js';
import { ToastHost } from './components.js';
import './styles.css';

const qc = new QueryClient({ defaultOptions: { queries: { refetchOnWindowFocus: false, staleTime: 15_000 } } });

function Root() {
  return <QueryClientProvider client={qc}>
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/erp/*" element={<ErpApp />} />
          <Route path="*" element={<PublicApp />} />
        </Routes>
        <ToastHost />
      </AppProvider>
    </BrowserRouter>
  </QueryClientProvider>;
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><Root /></React.StrictMode>);
