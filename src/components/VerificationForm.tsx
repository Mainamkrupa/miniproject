import React, { useState } from 'react';
import { Search, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { getCertificatesByRollNumber } from '../utils/storage'; // Assuming this function returns multiple certificates
import type { Certificate } from '../types/certificates';

interface VerificationResult {
  isValid: boolean;
  certificates?: Certificate[];
  message: string;
}

export function VerificationForm() {
  const [rollNumber, setRollNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const certificates = getCertificatesByRollNumber(rollNumber); // Function to get multiple certificates for the roll number

      if (certificates.length > 0) {
        setResult({
          isValid: true,
          certificates,
          message: 'Certificates verified successfully'
        });
      } else {
        setResult({
          isValid: false,
          message: 'No certificates found for this roll number'
        });
      }
    } catch (error) {
      setResult({
        isValid: false,
        message: 'Error verifying certificates'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
      <div className="flex items-center space-x-2 mb-6">
        <Search className="h-6 w-6 text-indigo-600" />
        <h2 className="text-2xl font-bold text-gray-800">Verify Certificates</h2>
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

      {result && (
        <div className={`mt-6 p-4 rounded-lg ${result.isValid ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className="flex items-center space-x-2">
            {result.isValid ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
            <p className={result.isValid ? 'text-green-700' : 'text-red-700'}>
              {result.message}
            </p>
          </div>

          {result.certificates && result.certificates.length > 0 && (
            <div className="mt-4 space-y-4">
              {result.certificates.map((certificate) => (
                <div key={certificate.id} className="space-y-2 text-gray-700">
                  <p><strong>Student Name:</strong> {certificate.studentName}</p>
                  <p><strong>Roll Number:</strong> {certificate.rollNumber}</p>
                  <p><strong>Institution:</strong> {certificate.institution}</p>
                  <p><strong>Course:</strong> {certificate.course}</p>
                  <p><strong>Type:</strong> {certificate.type}</p>
                  <p><strong>Issue Date:</strong> {certificate.issueDate}</p>
                  <p className="text-sm text-gray-500 mt-4">
                    <strong>Certificate ID:</strong> {certificate.id}
                  </p>
                  <p className="text-sm text-gray-500">
                    <strong>Hash:</strong> {certificate.hash}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
