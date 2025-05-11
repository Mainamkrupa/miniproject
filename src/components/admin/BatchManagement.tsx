import { Users } from 'lucide-react';
import { StudentBatchUpload } from './StudentBatchUpload';
import { StudentList } from './StudentList';

export function BatchManagement() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <Users className="h-6 w-6 text-indigo-600" />
        <h2 className="text-2xl font-bold text-gray-800">Student Batch Management</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <StudentBatchUpload />
        <StudentList year="2024" />
      </div>
    </div>
  );
}