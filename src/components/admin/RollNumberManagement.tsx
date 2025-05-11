import { useState } from 'react';
import { Upload, CheckCircle, Loader2 } from 'lucide-react';
import { sphoorthyRollNumbers, addBulkRollNumbers, validateSphoorthyRollNumber } from '../../utils/rollNumberBulk';

interface RollNumberManagementProps {
  universityId: string;
}

export function RollNumberManagement({ universityId }: RollNumberManagementProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddSphoorthyRollNumbers = () => {
    setIsLoading(true);
    setError(null);
    try {
      const validRollNumbers = sphoorthyRollNumbers.filter(validateSphoorthyRollNumber);
      if (validRollNumbers.length === 0) {
        throw new Error('No valid roll numbers found.');
      }
      addBulkRollNumbers(universityId, validRollNumbers);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to add roll numbers:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Roll Number Management</h3>
      
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">Roll numbers added successfully!</p>}
      
      <button
        onClick={handleAddSphoorthyRollNumbers}
        disabled={isLoading}
        className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {isLoading ? <Loader2 className="animate-spin mr-2" /> : <Upload className="mr-2" />}
        {isLoading ? 'Adding...' : 'Add Sphoorthy Roll Numbers'}
      </button>
    </div>
  );
}