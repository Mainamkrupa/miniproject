import { Header } from './components/Header';
import { AuthProvider } from './context/AuthContext';
import { AuthTabs } from './components/auth/AuthTabs';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { UniversityDashboard } from './components/dashboard/UniversityDashboard';
import { VerifierDashboard } from './components/dashboard/VerifierDashboard';
import { useAuth } from './context/AuthContext';

function MainContent() {
  const { user } = useAuth();

  return (
    <main>
      {!user ? (
        <div className="container mx-auto py-8 px-4">
          <section id="hero" className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Secure Academic Credentials on the Blockchain
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Issue and verify academic certificates with immutable blockchain technology
            </p>
          </section>
          <AuthTabs />
        </div>
      ) : (
        <div className="container mx-auto py-8 px-4">
          {user.role === 'student' && <StudentDashboard />}
          {user.role === 'university' && <UniversityDashboard />}
          {user.role === 'verifier' && <VerifierDashboard />}
        </div>
      )}
    </main>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <MainContent />
        <footer className="bg-gray-800 text-white py-8">
          <div className="container mx-auto px-4 text-center">
            <p>&copy; 2025 CertChain. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </AuthProvider>
  );
}