import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import Calendar from './pages/Calendar';
import Chart from './pages/Chart';
import ECommerce from './pages/Dashboard/ECommerce';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Tables from './pages/Tables';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import DefaultLayout from './layout/DefaultLayout';
import Clients from './components/Clients/Clients';
import ProtectedRoutes from './components/ProtectedRoutes';
import Auth from './components/Auth/Auth';
import SingleSupply from './components/Supply/SingleSupply';
import Supply from './components/Supply/Supply';
import ClientInvoice from './components/Invoice/ClientInvoice';
import Invoice from './components/Invoice/Invoice';
import SingleInvoice from './components/Invoice/SingleInvoice';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <DefaultLayout>
      <Routes>
        <Route path="/" element={<ProtectedRoutes />}>
          <Route
            index
            element={
              <>
                <PageTitle title="Dashboard | Waterfly -Waterfly Admin Dashboard" />
                <ECommerce />
              </>
            }
          />
          <Route
            path="/calendar"
            element={
              <>
                <PageTitle title="Calendar | Waterfly - Waterfly Admin Dashboard" />
                <Calendar />
              </>
            }
          />
          <Route
            path="/clients"
            element={
              <>
                <PageTitle title="Clients | Waterfly -Waterfly Admin Dashboard" />
                <Clients />
              </>
            }
          />
          <Route
            path="/bottles"
            element={
              <>
                <PageTitle title="Bottles | Waterfly -Waterfly Admin Dashboard" />
                <Supply />
              </>
            }
          />
          <Route
            path="/supplies/:clientId"
            element={
              <>
                <PageTitle title="Supplies | Waterfly -Waterfly Admin Dashboard" />
                <SingleSupply />
              </>
            }
          />
          {/* <Route
            path="/profile"
            element={
              <>
                <PageTitle title="Profile | Waterfly -Waterfly Admin Dashboard" />
                <Profile />
              </>
            }
          /> */}
          <Route
            path="/forms/form-elements"
            element={
              <>
                <PageTitle title="Form Elements | Waterfly -Waterfly Admin Dashboard" />
                <FormElements />
              </>
            }
          />
          <Route
            path="/forms/form-layout"
            element={
              <>
                <PageTitle title="Form Layout | Waterfly -Waterfly Admin Dashboard" />
                <FormLayout />
              </>
            }
          />
          <Route
            path="/all-invoices"
            element={
              <div >
                <div>
                  <PageTitle title="Invoices | Waterfly -Waterfly Admin Dashboard" />
                  <Invoice />
                </div>
              </div>
            }
          />
          <Route
            path="/invoice/:clientId"
            element={
              <>
                <PageTitle title="Invoice | Waterfly -Waterfly Admin Dashboard" />
                <ClientInvoice />
              </>
            }
          />
          <Route
            path="/singleInvoice/:invoiceId"
            element={
              <>
                <PageTitle title="Invoice | Waterfly -Waterfly Admin Dashboard" />
                <SingleInvoice />
              </>
            }
          />
          <Route
            path="/tables"
            element={
              <>
                <PageTitle title="Tables | Waterfly - Waterfly Admin Dashboard" />
                <Tables />
              </>
            }
          />
          <Route
            path="/profile"
            element={
              <>
                <PageTitle title="Profile | Waterfly - Waterfly Admin Dashboard" />
                <Settings />
              </>
            }
          />
          <Route
            path="/chart"
            element={
              <>
                <PageTitle title="Basic Chart | Waterfly -Waterfly Admin Dashboard" />
                <Chart />
              </>
            }
          />
          <Route
            path="/ui/alerts"
            element={
              <>
                <PageTitle title="Alerts | Waterfly - Waterfly Admin Dashboard" />
                <Alerts />
              </>
            }
          />
          <Route
            path="/ui/buttons"
            element={
              <>
                <PageTitle title="Buttons | Waterfly -Waterfly Admin Dashboard" />
                <Buttons />
              </>
            }
          />
        </Route>
        <Route path="/auth" element={<Auth />} />
        <Route path="/auth/signin" element={<SignIn />} />
      </Routes>
    </DefaultLayout>
  );
}

export default App;
