import React, { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './utils/i18n';
import { Skeleton } from 'antd';

// Import tay các component cần lazy load
const Signin = React.lazy(() => import('./pages/auth/Signin'));
const Signup = React.lazy(() => import('./pages/auth/Signup'));
const EmailVerify = React.lazy(() => import('./pages/auth/EmailVerify'));
const IsCheckAdmin = React.lazy(() => import('./pages/auth/IsCheckAdmin'));
const IsCheckDoctor = React.lazy(() => import('./pages/auth/IsCheckDoctor'));
const IsCheckUser = React.lazy(() => import('./pages/auth/IsCheckUser'));
const IsCheckLogin = React.lazy(() => import('./pages/auth/IsCheckLogin'));
const LayoutSite = React.lazy(() => import('./layout/site/LayoutSite'));
const Home = React.lazy(() => import('./pages/site/Home'));
const ListCategories = React.lazy(() => import('./pages/site/ListCategories'));
const AppointmentHist = React.lazy(() => import('./pages/site/AppointmentHist'));
const MedExamination = React.lazy(() => import('./pages/site/med-services/SpecialtyDetail'));
const ClinicsDetail = React.lazy(() => import('./pages/site/med-services/ClinicsDetail'))
const ClinicsChildren = React.lazy(() => import('./pages/site/med-services/ClinicsChildren'))
const LayoutAdmin = React.lazy(() => import('./layout/admin/LayoutAdmin'));
const SpecialtyManage = React.lazy(() => import('./pages/admin/SpecialtyManage/SpecialtyManage'));
const AddSpecialtyManage = React.lazy(() => import('./pages/admin/SpecialtyManage/AddSpecialty'));
const UpdateSpecialty = React.lazy(() => import('./pages/admin/SpecialtyManage/UpdateSpecialty'));
const ClinicsManage = React.lazy(() => import('./pages/admin/ClinicsManage/ClinicsManage'));
const ClinicsAdd = React.lazy(() => import('./pages/admin/ClinicsManage/ClinicsAdd'));
const ClinicsUpdate = React.lazy(() => import('./pages/admin/ClinicsManage/ClinicsUpdate'));
const AccountManage = React.lazy(() => import('./pages/admin/AccountManage/AccountManage'));
const AddAccount = React.lazy(() => import('./pages/admin/AccountManage/AddAccount'));
const UpdateDoctor = React.lazy(() => import('./pages/admin/AccountManage/UpdateDoctor'));
const MakeAppt = React.lazy(() => import('./pages/site/MakeAppt'));
const DoctorDetail = React.lazy(() => import('./pages/site/med-services/DoctorDetail'));
const Profile = React.lazy(() => import('./pages/site/profile/Profile'))
const LstProfile = React.lazy(() => import('./pages/site/profile/LstProfile'))
const AddProfile = React.lazy(() => import('./pages/site/profile/AddProfile'))
const UpdateProfile = React.lazy(() => import('./pages/site/profile/UpdateProfile'))
const ServiceManage = React.lazy(() => import('./pages/admin/ServiceManage/ServiceManage'));
const ServiceUpdate = React.lazy(() => import('./pages/admin/ServiceManage/ServiceUpdate'));
const ServiceAdd = React.lazy(() => import('./pages/admin/ServiceManage/ServiceAdd'));
const LayoutDoctor = React.lazy(() => import('./layout/doctor/LayoutDoctor'));
const BookingManage = React.lazy(() => import('./pages/doctor/BookingManage/BookingManage'));
const BookingAdd = React.lazy(() => import('./pages/doctor/BookingManage/BookingAdd'));
const BookingUpdate = React.lazy(() => import('./pages/doctor/BookingManage/BookingUpdate'));
const ServiceDoctorManage = React.lazy(() => import('./pages/doctor/ServiceManage/ServiceDoctorManage'));
const BookingResults = React.lazy(() => import('./components/BookingResults'));
const Manage = React.lazy(() => import('./pages/admin/Manage'));
const NotFound = React.lazy(() => import('./components/NotFound'));

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <Suspense fallback={<Skeleton />}>
          <Routes>
            <Route path="/" element={<LayoutSite />}>
              <Route index element={<Home />} />
              <Route path='danh-sach/:slug' element={<ListCategories />} />
              <Route path='dich-vu-y-te/:slug/:slug' element={<MedExamination />} />
              <Route path='co-so-y-te/:slug' element={<ClinicsDetail />} />
              <Route path='co-so-y-te/:slug/:id' element={<ClinicsChildren />} />
              <Route path='dat-lich/:id' element={<MakeAppt />} />
              <Route path='bac-si/:slug' element={<DoctorDetail />} />
              <Route path='dich-vu/:slug' element={<DoctorDetail />} />
              <Route element={<IsCheckUser />}>
                <Route path='lich-hen' element={<AppointmentHist />} />
                <Route path="ho-so-kham-benh" element={<Profile />}>
                  <Route index element={<LstProfile />} />
                  <Route path="them" element={<AddProfile />} />
                  <Route path="sua/:id" element={<UpdateProfile />} />
                </Route>
                <Route path='vnpay_return' element={<BookingResults />} />
              </Route>

            </Route>
            <Route element={<IsCheckDoctor />}>
              <Route path="/doctor" element={<LayoutDoctor />}>
                <Route path='quan-ly-lich-kham/bac-si/:idDoctor' element={<BookingManage />} />
                <Route path='quan-ly-lich-kham/dich-vu/:idDoctor' element={<BookingManage />} />
                <Route path='them-lich-kham/:idDoctor' element={<BookingAdd />} />
                <Route path='sua-lich-kham/:id/:idDoctor' element={<BookingUpdate />} />
                <Route path='lich-da-dat/dich-vu/:id' element={<ServiceDoctorManage />} />
                <Route path='lich-da-dat/bac-si/:id' element={<ServiceDoctorManage />} />
              </Route>
            </Route>
            <Route element={<IsCheckAdmin />}>
              <Route path="/admin" element={<LayoutAdmin />}>
                <Route path='quan-ly-chuyen-khoa' element={<SpecialtyManage />} />
                <Route path='them-chuyen-khoa' element={<AddSpecialtyManage />} />
                <Route path='sua-chuyen-khoa/:id' element={<UpdateSpecialty />} />
                <Route path='quan-ly-phong-kham' element={<ClinicsManage />} />
                <Route path='them-phong-kham' element={<ClinicsAdd />} />
                <Route path='sua-phong-kham/:id' element={<ClinicsUpdate />} />
                <Route path='quan-ly-tai-khoan' element={<AccountManage />} />
                <Route path='them-tai-khoan' element={<AddAccount />} />
                <Route path='cap-nhat-bac-si/:id' element={<UpdateDoctor />} />
                <Route path='quan-ly-dich-vu/:idDoctor' element={<ServiceManage />} />
                <Route path='cap-nhat-dich-vu/:id' element={<ServiceUpdate />} />
                <Route path='them-nhat-dich-vu/:idDoctor' element={<ServiceAdd />} />
                <Route path='lich-da-dat' element={<Manage />} />
              </Route>
            </Route>
            <Route element={<IsCheckLogin />}>
              <Route path='/login' element={<Signin />} />
            </Route>
            <Route path='/register' element={<Signup />} />
            <Route path='/auth/email-verification/:token' element={<EmailVerify />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </I18nextProvider>
  );
}

export default App;
