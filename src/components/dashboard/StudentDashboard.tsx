import { GraduationCap, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StudentCertificatesView } from './StudentCertificatesView';

export function StudentDashboard() {
  const { user, logout } = useAuth();

  const handleBack = () => {
    logout();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Logout
          </button>
          <div className="flex items-center">
            <GraduationCap className="h-8 w-8 text-indigo-600" />
            <div className="ml-3">
              <h2 className="text-2xl font-bold text-gray-800">Welcome, {user?.username}</h2>
              <p className="text-gray-600">Roll Number: {user?.rollNumber}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Ensure the certificates view can handle multiple certificates */}
          <h3 className="text-xl font-semibold text-gray-800">Your Certificates</h3>
          <StudentCertificatesView />
        </div>
      </div>
    </div>
  );
}
console.log('StudentDashboard.tsx');
