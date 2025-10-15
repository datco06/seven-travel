import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import CreateTour from './pages/CreateTour.jsx';
import Transport from './pages/Transport.jsx';
import TransportJourneyDetail from './pages/TransportJourneyDetail.jsx';
import Stay from './pages/Stay.jsx';
import StayCollectionDetail from './pages/StayCollectionDetail.jsx';
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
import FAQ from './pages/FAQ.jsx';
import Terms from './pages/Terms.jsx';
import OperatingRules from './pages/OperatingRules.jsx';
import HanoiTours from './pages/HanoiTours.jsx';
import HaiPhongTours from './pages/HaiPhongTours.jsx';
import NinhBinhTours from './pages/NinhBinhTours.jsx';
import SonLaTours from './pages/SonLaTours.jsx';
import LaoCaiTours from './pages/LaoCaiTours.jsx';
import PhuThoTours from './pages/PhuThoTours.jsx';
import LocalExperts from './pages/LocalExperts.jsx';
import CulinaryExperience from './pages/CulinaryExperience.jsx';
import MuseumExperience from './pages/MuseumExperience.jsx';
import WaterPuppetryExperience from './pages/WaterPuppetryExperience.jsx';
import StreetFoodExperience from './pages/StreetFoodExperience.jsx';
import PassionateTeam from './pages/PassionateTeam.jsx';
import PersonalizedService from './pages/PersonalizedService.jsx';
import SustainableTravel from './pages/SustainableTravel.jsx';

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
              <Route path="di-chuyen/:journeySlug" element={<TransportJourneyDetail />} />
              <Route path="luu-tru" element={<Stay />} />
              <Route path="luu-tru/:collectionSlug" element={<StayCollectionDetail />} />
              <Route path="tour-ha-noi" element={<HanoiTours />} />
              <Route path="tour-hai-phong" element={<HaiPhongTours />} />
              <Route path="tour-ninh-binh" element={<NinhBinhTours />} />
              <Route path="tour-son-la" element={<SonLaTours />} />
              <Route path="tour-lao-cai" element={<LaoCaiTours />} />
              <Route path="tour-phu-tho" element={<PhuThoTours />} />
              <Route path="chuyen-gia-ban-dia" element={<LocalExperts />} />
              <Route path="trai-nghiem-am-thuc" element={<CulinaryExperience />} />
              <Route path="tham-bao-tang-tu-nhan" element={<MuseumExperience />} />
              <Route path="nghe-thuat-mua-roi-nuoc" element={<WaterPuppetryExperience />} />
              <Route path="tour-am-thuc-duong-pho" element={<StreetFoodExperience />} />
              <Route path="doi-ngu-nhiet-huyet" element={<PassionateTeam />} />
              <Route path="dich-vu-ca-nhan-hoa" element={<PersonalizedService />} />
              <Route path="du-lich-ben-vung" element={<SustainableTravel />} />
              <Route path="dang-nhap" element={<Login />} />
              <Route path="dang-ky" element={<Register />} />
              <Route path="tai-khoan" element={<CustomerAccount />} />
              <Route path="tours/:slug" element={<TourDetails />} />
              <Route path="cau-hoi-thuong-gap" element={<FAQ />} />
              <Route path="dieu-khoan-dieu-kien" element={<Terms />} />
              <Route path="quy-che-hoat-dong" element={<OperatingRules />} />
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
