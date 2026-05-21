import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { ThemeProvider } from '@/lib/ThemeContext';
import CommandPalette from './components/CommandPalette';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import Dashboard from './pages/Dashboard';
import Employers from './pages/Employers';
import About from './pages/About';
import EditProfile from './pages/EditProfile';
import ResumeBuilder from './pages/ResumeBuilder';
import InterviewPrep from './pages/InterviewPrep';
import SalaryInsights from './pages/SalaryInsights';
import Recruiters from './pages/Recruiters';
import Pricing from './pages/Pricing';
import GetStarted from './pages/GetStarted';
import EmployerDashboardPage from './pages/EmployerDashboard';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();
  const { data: allJobs = [] } = useQuery({
    queryKey: ["jobs"],
    queryFn: () => base44.entities.Job.list("-created_date", 200),
  });

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <>
      <CommandPalette jobs={allJobs} />
      <Routes>
        <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employers" element={<Employers />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/resume-builder" element={<ResumeBuilder />} />
        <Route path="/interview-prep" element={<InterviewPrep />} />
        <Route path="/salary-insights" element={<SalaryInsights />} />
        <Route path="/recruiters" element={<Recruiters />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/employer-dashboard" element={<EmployerDashboardPage />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
    </>
  );
};

function App() {
  return (
    <ThemeProvider>
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
    </ThemeProvider>
  )
}

export default App