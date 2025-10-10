import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import CreateTour from './pages/CreateTour.jsx';
import Transport from './pages/Transport.jsx';
import Stay from './pages/Stay.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import CustomerAccount from './pages/CustomerAccount.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminStats from './pages/AdminStats.jsx';
import AdminSupport from './pages/AdminSupport.jsx';
import { LanguageProvider } from './context/LanguageContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import TourDetails from './pages/TourDetails.jsx';
import AdminLayout from './components/AdminLayout.jsx';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="tao-tour" element={<CreateTour />} />
              <Route path="di-chuyen" element={<Transport />} />
              <Route path="luu-tru" element={<Stay />} />
              <Route path="dang-nhap" element={<Login />} />
              <Route path="dang-ky" element={<Register />} />
              <Route path="tai-khoan" element={<CustomerAccount />} />
              <Route path="tours/:slug" element={<TourDetails />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>

            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="thong-ke" element={<AdminStats />} />
              <Route path="ho-tro" element={<AdminSupport />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
