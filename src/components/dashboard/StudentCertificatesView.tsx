import React, { useEffect, useState } from 'react';
import { Download, Award, ExternalLink } from 'lucide-react';
import { getCertificatesByStudent } from '../../utils/certificates';
import { useAuth } from '../../context/AuthContext';
import { generateCertificateHash } from '../../utils/blockchain';

import { CertificateType } from '../../types/certificates';

interface Certificate {
  id: string;
  studentName: string;
  rollNumber: string;
  institution: string;
  course: string;
  issueDate: string;
  hash: string;
  issuedAt: string;
  type: CertificateType;
  documentUrl?: string;
}

export function StudentCertificatesView() {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [visibleHash, setVisibleHash] = useState<Record<string, string>>({});

  useEffect(() => {
    async function fetchCertificates() {
      if (user?.rollNumber) {
        const certs = await getCertificatesByStudent(user.rollNumber);
        setCertificates(certs);
      }
    }

    fetchCertificates();
  }, [user?.rollNumber]);

  const sendOTP = async (phone: string) => {
    try {
      const response = await fetch('http://localhost:5176/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: phone }),
      });

      const result = await response.json();
      if (result.success) {
        setOtpSent(true);
        alert('OTP sent to your phone.');
      } else {
        alert('Failed to send OTP.');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert('There was an issue sending OTP. Please try again.');
    }
  };

  const verifyOTP = async () => {
    try {
      const response = await fetch('http://localhost:5176/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, otp }),
      });

      const result = await response.json();
      if (result.success) {
        setOtpVerified(true);
        alert('OTP verified successfully. You can now download the certificate.');
      } else {
        alert('Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      alert('There was an issue verifying OTP. Please try again.');
    }
  };

  const handleDownload = (cert: Certificate) => {
    if (!otpVerified) {
      alert('Please verify your OTP before downloading.');
      return;
    }

    if (cert.documentUrl) {
      const a = document.createElement('a');
      a.href = cert.documentUrl;
      a.download = `${cert.course}_Certificate.pdf`;
      a.click();
    } else {
      alert('Certificate document is not available for download.');
    }
  };

  const handleView = async (cert: Certificate) => {
    try {
      const hash = await generateCertificateHash(cert);
      setVisibleHash((prev) => ({ ...prev, [cert.id]: hash }));
    } catch (error) {
      console.error('Error generating certificate hash:', error);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Your Certificates</h2>
      {certificates.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {certificates.map((cert) => (
            <div key={cert.id} className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">{cert.type}</h3>
                  <p className="text-sm text-gray-500">{cert.course}</p>
                </div>
                <Award className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="mt-4 space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Issue Date:</span> {cert.issueDate}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Institution:</span> {cert.institution}
                </p>
                {visibleHash[cert.id] && (
                  <p className="text-sm">
                    <span className="font-medium">Hash:</span> {visibleHash[cert.id]}
                  </p>
                )}
              </div>
              <div className="mt-4 flex space-x-3">
                <button
                  onClick={() => handleView(cert)}
                  className="flex items-center text-sm text-indigo-600 hover:text-indigo-500"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View
                </button>
                <button
                  onClick={() => handleDownload(cert)}
                  className="flex items-center text-sm text-indigo-600 hover:text-indigo-500"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No certificates available.</p>
      )}

      {/* OTP Input Section */}
      <div className="mt-4">
        {!otpVerified && (
          <>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <button
              onClick={() => sendOTP(phoneNumber)}
              className="mt-2 text-sm text-indigo-600 hover:text-indigo-500"
            >
              Send OTP
            </button>
          </>
        )}
        {otpSent && !otpVerified && (
          <>
            <label className="block text-sm font-medium text-gray-700 mt-4">Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <button
              onClick={verifyOTP}
              className="mt-2 text-sm text-indigo-600 hover:text-indigo-500"
            >
              Verify OTP
            </button>
          </>
        )}
      </div>
    </div>
  );
}
