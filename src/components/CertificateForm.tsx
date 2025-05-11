import React, { useState } from 'react';
import { FileCheck, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { issueCertificates } from '../utils/certificate';
import { uploadFile } from '../utils/file';
import { FileUpload } from './FileUpload';
import type { CertificateData, CertificateType } from '../types/certificates';

const CERTIFICATE_TYPES: { value: CertificateType; label: string }[] = [
  { value: 'DEGREE', label: 'Degree Certificate' },
  { value: 'DIPLOMA', label: 'Diploma Certificate' },
  { value: 'COURSE', label: 'Course Completion' },
  { value: 'PROFESSIONAL', label: 'Professional Certification' },
  { value: 'ACHIEVEMENT', label: 'Achievement Certificate' },
  { value: 'TRANSCRIPT', label: 'Academic Transcript' },
  { value: 'TRAINING', label: 'Training Certificate' },
  { value: 'RESEARCH', label: 'Research Certificate' },
  { value: 'SKILL', label: 'Skill Certificate' },
  { value: 'LICENSE', label: 'Professional License' }
];

export function CertificateForm() {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<CertificateData[]>([
    {
      studentName: '',
      rollNumber: '',
      institution: user?.collegeName || '',
      course: '',
      issueDate: '',
      type: 'COURSE'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<(File | null)[]>([]);

  const handleCertificateChange = (index: number, field: string, value: string) => {
    const updatedCertificates = [...certificates];
    updatedCertificates[index] = { ...updatedCertificates[index], [field]: value };
    setCertificates(updatedCertificates);
  };

  const handleFileSelect = (index: number, file: File | null) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles[index] = file;
    setSelectedFiles(updatedFiles);
  };

  const handleAddCertificate = () => {
    setCertificates([
      ...certificates,
      {
        studentName: '',
        rollNumber: '',
        institution: user?.collegeName || '',
        course: '',
        issueDate: '',
        type: 'COURSE'
      }
    ]);
    setSelectedFiles([...selectedFiles, null]);
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   setError(null);

  //   try {
  //     for (let i = 0; i < certificates.length; i++) {
  //       let documentUrl: string | undefined;

        
  //             if (selectedFiles[i]) {
  //               if (selectedFiles[i]) {
  //                 documentUrl = await uploadFile(selectedFiles[i] as File);
  //               }
  //             }
            
          
        

  //       await issueCertificates(certificates, selectedFiles.filter((file): file is File => file !== null));
  //     }

  //     setSuccess(true);
  //     setCertificates([
  //       {
  //         studentName: '',
  //         rollNumber: '',
  //         institution: user?.collegeName || '',
  //         course: '',
  //         issueDate: '',
  //         type: 'COURSE'
  //       }
  //     ]);
  //     setSelectedFiles([null]);
  //     setTimeout(() => setSuccess(false), 3000);
  //   } catch (err) {
  //     setError(err instanceof Error ? err.message : 'Failed to issue certificates');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
  
    try {
      const uploadedCertificates: CertificateData[] = [];
  
      for (let i = 0; i < certificates.length; i++) {
        const certificate = certificates[i];
        const file = selectedFiles[i];
  
        if (!certificate.studentName || !certificate.rollNumber || !certificate.course || !certificate.issueDate) {
          throw new Error('All fields are required for issuing a certificate.');
        }
  
        let documentUrl: string | undefined;
        if (file) {
          documentUrl = await uploadFile(file);
        }
  
        uploadedCertificates.push({ ...certificate, documentUrl });
      }
  
      await issueCertificates(uploadedCertificates, selectedFiles.filter((file): file is File => file !== null));
  
      setSuccess(true);
      setCertificates([
        {
          studentName: '',
          rollNumber: '',
          institution: user?.collegeName || '',
          course: '',
          issueDate: '',
          type: 'COURSE'
        }
      ]);
      setSelectedFiles([null]);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to issue certificates');
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <div className="flex items-center space-x-2 mb-6">
        <FileCheck className="h-6 w-6 text-indigo-600" />
        <h2 className="text-2xl font-bold text-gray-800">Issue New Certificates</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {certificates.map((certificate, index) => (
          <div key={index} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Certificate Type</label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={certificate.type}
                onChange={(e) => handleCertificateChange(index, 'type', e.target.value)}
                required
              >
                {CERTIFICATE_TYPES.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Student Name</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={certificate.studentName}
                onChange={(e) => handleCertificateChange(index, 'studentName', e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Roll Number</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={certificate.rollNumber}
                onChange={(e) => handleCertificateChange(index, 'rollNumber', e.target.value)}
                placeholder="Enter student roll number"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Course Name</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={certificate.course}
                onChange={(e) => handleCertificateChange(index, 'course', e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Issue Date</label>
              <input
                type="date"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={certificate.issueDate}
                onChange={(e) => handleCertificateChange(index, 'issueDate', e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Certificate Document
              </label>
              <FileUpload
                onFileSelect={(file) => handleFileSelect(index, file)}
                accept=".pdf,.png,.jpg,.jpeg"
                maxSize={5}
              />
            </div>
          </div>
        ))}

        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={handleAddCertificate}
            className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
          >
            Add Another Certificate
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin h-5 w-5 mr-2" />
              Issuing...
            </>
          ) : (
            'Issue Certificates'
          )}
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-md flex items-center">
            <FileCheck className="h-5 w-5 mr-2" />
            Certificates issued successfully!
          </div>
        )}
      </form>
    </div>
  );
}
