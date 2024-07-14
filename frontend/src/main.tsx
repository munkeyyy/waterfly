import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './css/style.css';
import './css/satoshi.css';
import 'jsvectormap/dist/css/jsvectormap.css';
import 'flatpickr/dist/flatpickr.min.css';
import LoginProvider from './Contexts/LoginContext/LoginProvider';
import UserProvider from './Contexts/User/UserProvider';
import { SearchProvider } from './Contexts/Search/SearchContext';
import InvoiceProvider from './Contexts/InvoiceContext/InvoiceProvider';
import ReportProvider from './Contexts/ReportContext/ReportProvider';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Router>
    <SearchProvider>
      <LoginProvider>
        <UserProvider>
          <ReportProvider>
            <InvoiceProvider>
              <App />
            </InvoiceProvider>
          </ReportProvider>
        </UserProvider>
      </LoginProvider>
    </SearchProvider>
  </Router>,
);
