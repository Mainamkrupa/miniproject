
import React, { useState } from 'react';
import { LogIn, ArrowLeft } from 'lucide-react';
import { registerUser } from '../../utils/auth'; // Ensure you're using the correct utility for registration
import type { UserRole } from '../../types/auth';

export function RegisterForm({ onBack }: { onBack: () => void }) {
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    role: 'student' as UserRole,
    rollNumber: '',
    collegeName: '', // Added collegeName field
  });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      await registerUser({
        ...formData,
        identifier: formData.role === 'student' ? formData.rollNumber : formData.identifier,
      });

      setSuccessMessage('Successfully registered! Please log in to continue.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-800 flex items-center"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back
        </button>
        <div className="flex items-center">
          <LogIn className="h-6 w-6 text-indigo-600" />
          <h2 className="text-2xl font-bold text-gray-800 ml-2">Register</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
          >
            <option value="student">Student</option>
            <option value="university">University</option>
            <option value="verifier">Verifier</option>
          </select>
        </div>

        {formData.role === 'student' ? (
          <div>
            <label className="block text-sm font-medium text-gray-700">Roll Number</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.rollNumber}
              onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
              placeholder="Enter your roll number"
              required
            />
          </div>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.identifier}
                onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                placeholder="Enter your username"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">College Name</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.collegeName}
                onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                placeholder="Enter your college name"
                required
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Register
        </button>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="p-4 bg-green-50 text-green-700 rounded-md">
            {successMessage}
          </div>
        )}
      </form>
    </div>
  );
}
