export function StudentRegistrationForm({ onSubmit, error, successMessage }: { 
  onSubmit: (data: { password: string; rollNumber: string }) => void;
  error: string | null;
  successMessage: string | null;
}) {
  return (
    <form onSubmit={(e) => { 
      e.preventDefault(); 
      const data = {
        rollNumber: e.currentTarget.rollNumber.value,
        password: e.currentTarget.password.value,
      };
      onSubmit(data); 
    }} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Roll Number</label>
        <input
          type="text"
          name="rollNumber"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          name="password"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      {successMessage && (
        <div className="p-4 bg-green-50 text-green-700 rounded-md">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Register
      </button>
    </form>
  );
}