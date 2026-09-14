import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
} from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import Home from "./pages/Home/Home";
import AssociationAbout from "./pages/About/association/About.jsx";
import OrganizationStructureAbout from "./pages/About/organizationStructure/About.jsx";
import ThirtiethCouncilAbout from "./pages/About/CouncilOfThirty/About.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import Blogs from "./pages/Blogs/blog/Blogs.jsx";
import Donation from "./pages/Blogs/donation/Donation.jsx";
import Issues from "./pages/Blogs/issues/Issues.jsx";
import News from "./pages/Blogs/news/News.jsx";
import Post from "./pages/Blogs/post/Post.jsx";
// import GalleryDashboard from "./pages/Gallery/GalleryDashboard";
// import GalleryEntry from "./pages/Gallery/GalleryEntry";
import MainLayout from "./layouts/MainLayout";
import StandaloneLayout from "./layouts/StandaloneLayout";
import "./App.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PublicOnlyRoute from "./components/PublicOnlyRoute.jsx";
import AdminUsersDashboard from "./pages/Admin/Admin Users/AdminUsersDashboard.jsx";
import AdminUsersEntry from "./pages/Admin/Admin Users/AdminUsersEntry.jsx";
import Dashboard from "./pages/Admin/Dashboard/Dashboard.jsx";
import ImageStorageDashboard from "./pages/Admin/Image Storage/ImageStorageDashboard.jsx";
import { CONFIG } from "./config";
import ProfilePage from "./pages/Profile/ProfilePage.jsx";
import UsersDashboard from './pages/Admin/Users/UsersDashboard.jsx';
import UsersEntry from "./pages/Admin/Users/UsersEntry.jsx";
import FormEntry from './pages/forms/FormEntry.jsx';
import FormsDashboard from './pages/forms/FormsDashboard.jsx';
import FormsGallery from './pages/forms/FormsGallery';
import ScrollToTop from "./components/ScrollToTop";
import ScrollToTopButton from "./components/ScrollToTopButton.jsx";
import AdminBotEditor from "./pages/Admin/bot/AdminBotEditor.jsx";
import PostsEntry from "./pages/Admin/Posts/PostsEntry.jsx";
import PostsDashboard from "./pages/Admin/Posts/PostsDashboard.jsx";
import FormAnalysisView from './pages/forms/FormAnalysisView';
import AnalysisGallery from './pages/forms/AnalysisGallery';
import ApplicationView from './pages/forms/ApplicationView';
import CategoryView from './pages/forms/CategoryView'; // Make sure this is here!
import Events from "./pages/Events/Events.jsx";
import EventsDashboard from "./pages/Admin/Events/EventsDashboard.jsx";
import EventsEntry from "./pages/Admin/Events/EventsEntry.jsx";
import AdminRoleGuard from "./components/AdminRoleGuard.jsx";
import VerifyCertificate from "./components/verification/VerifyCertificate.jsx";
import VerifyDocument from "./components/verification/VerifyDocument.jsx";
import TeamsDashboard from "./pages/Admin/Teams/TeamsDashboard.jsx";
import PasscodeLookup from "./pages/Admin/passcode/PasscodeLookup.jsx";
import InitialRegister from "./pages/auth/InitialRegister.jsx";
import RegistrationFlow from "./pages/auth/RegistrationFlow.jsx";
import LoginForm from "./pages/auth/LoginForm.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";

import React, { useEffect } from 'react';
import ReactGA from 'react-ga4';
import CertificatesDashboard from "./pages/Admin/Certificates/CertificatesDashboard.jsx";
import CertificatesEntry from "./pages/Admin/Certificates/CertificatesEntry.jsx";
import TemplatesDashboard from "./pages/Admin/Certificate Templates/TemplatesDashboard.jsx";
import TemplatesEntry from "./pages/Admin/Certificate Templates/TemplatesEntry.jsx";

ReactGA.initialize('G-S8J4CN53DH');

const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
  }, [location]);

  return null; 
};

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <ScrollToTop />
          <AnalyticsTracker />
          <Routes>
            {/* PUBLIC ROUTES (Accessible by everyone) */}
            {/* Main Layout containing NavBar and Footer */}
            <Route element={<MainLayout />}  >
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/" element={<Home />} />
              {/* Add other public routes here */}
              <Route path="/forms" element={<FormsGallery />} />
              <Route path="/apply/:formId" element={<ApplicationView />} />
              <Route path="/forms/category/:categoryId" element={<CategoryView />} />
              <Route path="/about/association" element={<AssociationAbout />} />
              <Route path="/about/organization-structure" element={<OrganizationStructureAbout />} />
              <Route path="/about/council-of-thirty" element={<ThirtiethCouncilAbout />} />
              <Route path="/events" element={<Events />} />
              <Route path="/posts/announcements" element={<Blogs />} />
              <Route path="/posts/donations" element={<Donation />} />
              <Route path="/posts/announcements" element={<Blogs />} />
              <Route path="/posts/issues" element={<Issues />} />
              <Route path="/posts/news" element={<News />} />
              <Route path="/posts/:type/:slug" element={<Post />} /> { /* view posts */}
              <Route path="/cert/verify/:hash" element={<VerifyCertificate />} />
              <Route path="/doc/verify/:hash" element={<VerifyDocument />} />
            </Route>

            {/* GUEST ONLY ROUTES (Login/Register) 
              - Logged in users get kicked out to /admin or / */}
            {/* Standalone Layout containing only Back to Home button */}
            <Route element={<StandaloneLayout />}>
              <Route element={<PublicOnlyRoute />}>
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<InitialRegister />} />
                <Route path="/register/:code" element={<RegistrationFlow />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
              </Route>
            </Route>

            {/* ADMIN ROUTES (Protected)
                - Only users with role 'admin' can enter */}
            {/* Admin Routes wrapped in StandaloneLayout so they have the Back button */}
            <Route element={<ProtectedRoute allowedRoles={CONFIG.ADMIN_ROLES} />}>
              <Route path="/admin" element={<AdminLayout />}>
                {/* <Route index element={<Navigate to="dashboard" replace />} /> */}
                
                {/* Dashboard: Open to all admins */}
                {/* <Route path="dashboard" element={<Dashboard />} /> */}
                
                {/* Content: Posts */}
                <Route path="posts" element={<AdminRoleGuard allowedRoles={["content:blog_manager"]}><PostsDashboard /></AdminRoleGuard>} />
                <Route path="posts/:id" element={<AdminRoleGuard allowedRoles={["content:blog_manager"]}><PostsEntry /></AdminRoleGuard>} />
                
                {/* Content: Media Storage */}
                <Route path="image-storage" element={<AdminRoleGuard allowedRoles={["content:editor"]}><ImageStorageDashboard /></AdminRoleGuard>} />
                
                {/* Operations: Events */}
                <Route path="events" element={<AdminRoleGuard allowedRoles={["content:event_manager"]}><EventsDashboard /></AdminRoleGuard>} />
                <Route path="events/:id" element={<AdminRoleGuard allowedRoles={["content:event_manager"]}><EventsEntry /></AdminRoleGuard>} />
                
                {/* Operations: Forms */}
                <Route path="forms" element={<AdminRoleGuard allowedRoles={["content:form_manager"]}><FormsDashboard /></AdminRoleGuard>} />
                <Route path="forms/create" element={<AdminRoleGuard allowedRoles={["content:form_manager"]}><FormEntry /></AdminRoleGuard>} />
                <Route path="forms/edit/:id" element={<AdminRoleGuard allowedRoles={["content:form_manager"]}><FormEntry /></AdminRoleGuard>} />
                <Route path="forms/analysis" element={<AdminRoleGuard allowedRoles={["content:form_manager"]}><AnalysisGallery /></AdminRoleGuard>} />
                <Route path="forms/analysis/:id" element={<AdminRoleGuard allowedRoles={["content:form_manager"]}><FormAnalysisView /></AdminRoleGuard>} />
                
                {/* Operations: Bot */}
                <Route path="bot" element={<AdminRoleGuard allowedRoles={["content:editor"]}><AdminBotEditor /></AdminRoleGuard>} />
                
                {/* Accounts: Admin Users */}
                <Route path="admin-users" element={<AdminRoleGuard allowedRoles={["sys:admin_manager"]}><AdminUsersDashboard /></AdminRoleGuard>} />
                <Route path="admin-users/:id" element={<AdminRoleGuard allowedRoles={["sys:admin_manager"]}><AdminUsersEntry /></AdminRoleGuard>} />
                
                {/* Accounts: Platform Users */}
                <Route path="users" element={<AdminRoleGuard allowedRoles={["sys:user_manager"]}><UsersDashboard /></AdminRoleGuard>} />
                <Route path="users/:id" element={<AdminRoleGuard allowedRoles={["sys:user_manager"]}><UsersEntry /></AdminRoleGuard>} />

                {/* TEAMS: Council members */}
                <Route path="teams" element={<AdminRoleGuard allowedRoles={["content:editor"]}><TeamsDashboard /></AdminRoleGuard>} />

                {/* USERS: Passcode lookup */}
                <Route path="passcode" element={<AdminRoleGuard allowedRoles={["sys:user_manager"]}><PasscodeLookup /></AdminRoleGuard>} />
                
                {/* Certificates Management: Certificates */}
                <Route path="certificates" element={<AdminRoleGuard allowedRoles={["cert:certifier", "cert:manager", "cert:viewer"]}><CertificatesDashboard /></AdminRoleGuard>} />
                <Route path="certificates/:id" element={<AdminRoleGuard allowedRoles={["cert:certifier", "cert:manager", "cert:viewer"]}><CertificatesEntry /></AdminRoleGuard>} />
                
                {/* Certificates Management: Certificate Templates */}
                <Route path="certificate-templates" element={<AdminRoleGuard allowedRoles={["cert:certifier", "cert:manager", "cert:viewer"]}><TemplatesDashboard /></AdminRoleGuard>} />
                <Route path="certificate-templates/:id" element={<AdminRoleGuard allowedRoles={["cert:certifier", "cert:manager", "cert:viewer"]}><TemplatesEntry /></AdminRoleGuard>} />
                
                <Route path="*" element={<Navigate to="/admin/dashboard" />} />
              </Route>
            </Route>

            {/* </Route> */}
            {/* STUDENT ROUTES (Future) */}
            {/* 
            <Route element={<MainLayout />}>
              <Route element={<ProtectedRoute allowedRoles={['student']} />}>
                 <Route path="/student/courses" element={<Courses />} />
              </Route>
            </Route> 
            */}
            <Route path="*" element={<Navigate to={"/"} />} />
          </Routes>
          <ScrollToTopButton />
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
