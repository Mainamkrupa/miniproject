import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

export function AuthTabs() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="flex mb-4 bg-gray-100 rounded-lg p-1">
        <button
          className={`flex-1 py-2 rounded-md ${
            activeTab === 'login' ? 'bg-white shadow' : 'hover:bg-gray-50'
          }`}
          onClick={() => setActiveTab('login')}
        >
          Login
        </button>
        <button
          className={`flex-1 py-2 rounded-md ${
            activeTab === 'register' ? 'bg-white shadow' : 'hover:bg-gray-50'
          }`}
          onClick={() => setActiveTab('register')}
        >
          Register
        </button>
      </div>
      {activeTab === 'login' ? (
        <LoginForm onBack={() => setActiveTab('register')} />
      ) : (
        <RegisterForm onBack={() => setActiveTab('login')} />
      )}
    </div>
  );
}