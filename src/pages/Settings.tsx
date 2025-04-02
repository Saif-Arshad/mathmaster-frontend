
import React from 'react';
import Header from '@/components/Header';

const Settings: React.FC = () => {
  return (
    <div className="min-h-screen bg-sky-100">
      <Header />
      <main className="ml-64 pt-8 px-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Settings</h1>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <p className="text-gray-600">Settings page content will be added here.</p>
        </div>
      </main>
    </div>
  );
};

export default Settings;
