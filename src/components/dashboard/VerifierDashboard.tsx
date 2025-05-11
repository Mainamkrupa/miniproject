import React, { useState } from 'react';
import { Search, CheckCircle, XCircle, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { verifyCertificates } from '../../utils/verification';
import type { Certificate } from '../../types/certificates';

export function VerifierDashboard() {
  const { logout } = useAuth();
  const [rollNumber, setRollNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleBack = () => {
    logout();
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await verifyCertificates(rollNumber);
      setCertificates(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error verifying certificates');
    } finally {
      setIsLoading(false);
    }
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
            Back
          </button>
          <div className="flex items-center">
            <Search className="h-6 w-6 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-800 ml-2">Verify Certificates</h2>
          </div>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Student Roll Number</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              placeholder="Enter student roll number"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                Verifying...
              </>
            ) : (
              'Verify Certificates'
            )}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {certificates.length > 0 && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-4">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <p className="text-green-700">Certificates verified successfully!</p>
            </div>
            {certificates.map((certificate, index) => (
              <div key={index} className="space-y-2 text-gray-700">
                <p><strong>Student Name:</strong> {certificate.studentName}</p>
                <p><strong>Roll Number:</strong> {certificate.rollNumber}</p>
                <p><strong>Institution:</strong> {certificate.institution}</p>
                <p><strong>Course:</strong> {certificate.course}</p>
                <p><strong>Type:</strong> {certificate.type}</p>
                <p><strong>Issue Date:</strong> {certificate.issueDate}</p>
                <hr className="my-4" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
