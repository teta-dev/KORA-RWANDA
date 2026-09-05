import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import UserProtectedRoute from './components/UserProtectedRoute';
import EmployerProtectedRoute from './components/EmployerProtectedRoute';
import TrainingProviderProtectedRoute from './components/TrainingProviderProtectedRoute';

// Public Pages
import Home from './pages/Home';
import Opportunities from './pages/Opportunities';
import OpportunityDetail from './pages/OpportunityDetail';
import Scholarships from './pages/Scholarships';
import Jobs from './pages/Jobs';
import Internships from './pages/Internships';
import Training from './pages/Training';

// Admin Pages
import AdminDashboard from './pages/Admin/Dashboard';
import AddOpportunity from './pages/Admin/AddOpportunity';
import AdminLogin from './pages/Admin/Login';
import AdminRegister from './pages/Admin/Register';
import ForgotPassword from './pages/Admin/ForgotPassword';

// User Pages (Version 1 & 2)
import UserRegister from './pages/User/Register';
import UserLogin from './pages/User/Login';
import UserDashboard from './pages/User/Dashboard';
import UserProfile from './pages/User/Profile';
import UserSaved from './pages/User/Saved';
import UserApplications from './pages/User/Applications';
import UserChecklist from './pages/User/Checklist';
import UserCV from './pages/User/CV';
import UserDeadlines from './pages/User/Deadlines';

// Version 3 - Employer Pages
import EmployerDashboard from './pages/Employer/Dashboard';
import EmployerLogin from './pages/Employer/Login';
import EmployerRegister from './pages/Employer/Register';
import EmployerProfile from './pages/Employer/Profile';

// Version 3 - Training Provider Pages
import TrainingProviders from './pages/TrainingProviders';
import TrainingProviderDetail from './pages/TrainingProviderDetail';
import TrainingProviderLogin from './pages/TrainingProvider/Login';
import TrainingProviderRegister from './pages/TrainingProvider/Register';
import TrainingProviderDashboard from './pages/TrainingProvider/Dashboard';

// Version 3 - Recommendations & Matching
import Recommendations from './pages/User/Recommendations';
import InternshipMatches from './pages/User/InternshipMatches';

// Test Page
import TestLogin from './pages/User/TestLogin';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* ============================================================ */}
            {/* PUBLIC ROUTES */}
            {/* ============================================================ */}
            <Route path="/" element={<Home />} />
            <Route path="/opportunities" element={<Opportunities />} />
            <Route path="/opportunity/:id" element={<OpportunityDetail />} />
            <Route path="/scholarships" element={<Scholarships />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/internships" element={<Internships />} />
            <Route path="/training" element={<Training />} />
            
            {/* ============================================================ */}
            {/* VERSION 3 - TRAINING PROVIDER PUBLIC ROUTES */}
            {/* ============================================================ */}
            <Route path="/training-providers" element={<TrainingProviders />} />
            <Route path="/training-provider/:id" element={<TrainingProviderDetail />} />
            
            {/* ============================================================ */}
            {/* USER AUTH ROUTES (Version 1) */}
            {/* ============================================================ */}
            <Route path="/user/register" element={<UserRegister />} />
            <Route path="/user/login" element={<UserLogin />} />
            
            {/* ============================================================ */}
            {/* USER PROTECTED ROUTES (Version 1 & 2) */}
            {/* ============================================================ */}
            <Route path="/user/dashboard" element={
              <UserProtectedRoute>
                <UserDashboard />
              </UserProtectedRoute>
            } />
            <Route path="/user/profile" element={
              <UserProtectedRoute>
                <UserProfile />
              </UserProtectedRoute>
            } />
            <Route path="/user/saved" element={
              <UserProtectedRoute>
                <UserSaved />
              </UserProtectedRoute>
            } />
            <Route path="/user/applications" element={
              <UserProtectedRoute>
                <UserApplications />
              </UserProtectedRoute>
            } />
            <Route path="/user/checklist/:id" element={
              <UserProtectedRoute>
                <UserChecklist />
              </UserProtectedRoute>
            } />
            <Route path="/user/cv" element={
              <UserProtectedRoute>
                <UserCV />
              </UserProtectedRoute>
            } />
            <Route path="/user/deadlines" element={
              <UserProtectedRoute>
                <UserDeadlines />
              </UserProtectedRoute>
            } />
            
            {/* ============================================================ */}
            {/* VERSION 3 - USER RECOMMENDATIONS & MATCHING */}
            {/* ============================================================ */}
            <Route path="/recommendations" element={
              <UserProtectedRoute>
                <Recommendations />
              </UserProtectedRoute>
            } />
            <Route path="/internship-matches/:id" element={
              <UserProtectedRoute>
                <InternshipMatches />
              </UserProtectedRoute>
            } />
            
            {/* ============================================================ */}
            {/* VERSION 3 - EMPLOYER AUTH ROUTES */}
            {/* ============================================================ */}
            <Route path="/employer/login" element={<EmployerLogin />} />
            <Route path="/employer/register" element={<EmployerRegister />} />
            
            {/* ============================================================ */}
            {/* VERSION 3 - EMPLOYER PROTECTED ROUTES */}
            {/* ============================================================ */}
            <Route path="/employer/dashboard" element={
              <EmployerProtectedRoute>
                <EmployerDashboard />
              </EmployerProtectedRoute>
            } />
            <Route path="/employer/profile" element={
              <EmployerProtectedRoute>
                <EmployerProfile />
              </EmployerProtectedRoute>
            } />
            
            {/* ============================================================ */}
            {/* VERSION 3 - TRAINING PROVIDER AUTH ROUTES */}
            {/* ============================================================ */}
            <Route path="/training-provider/login" element={<TrainingProviderLogin />} />
            <Route path="/training-provider/register" element={<TrainingProviderRegister />} />
            
            {/* ============================================================ */}
            {/* VERSION 3 - TRAINING PROVIDER PROTECTED ROUTES */}
            {/* ============================================================ */}
            <Route path="/training-provider/dashboard" element={
              <TrainingProviderProtectedRoute>
                <TrainingProviderDashboard />
              </TrainingProviderProtectedRoute>
            } />
            
            {/* ============================================================ */}
            {/* ADMIN AUTH ROUTES */}
            {/* ============================================================ */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/register" element={<AdminRegister />} />
            <Route path="/admin/forgot-password" element={<ForgotPassword />} />
            
            {/* ============================================================ */}
            {/* ADMIN PROTECTED ROUTES */}
            {/* ============================================================ */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/add" element={
              <ProtectedRoute>
                <AddOpportunity />
              </ProtectedRoute>
            } />
            <Route path="/admin/edit/:id" element={
              <ProtectedRoute>
                <AddOpportunity />
              </ProtectedRoute>
            } />
            
            {/* ============================================================ */}
            {/* TEST ROUTE */}
            {/* ============================================================ */}
            <Route path="/test-login" element={<TestLogin />} />
            
            {/* ============================================================ */}
            {/* CATCH ALL - 404 */}
            {/* ============================================================ */}
            <Route path="*" element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-gray-300">404</h1>
                  <p className="text-xl text-gray-500 mt-2">Page not found</p>
                  <Link to="/" className="mt-4 inline-block text-rwanda-green hover:underline">
                    Go back home
                  </Link>
                </div>
              </div>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;