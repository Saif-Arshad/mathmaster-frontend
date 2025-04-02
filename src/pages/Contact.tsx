
import React from 'react';
import Header from '@/components/Header';

const Contact: React.FC = () => {
  return (
    <div className="min-h-screen bg-sky-100">
      <Header />
      <main className="ml-64 pt-8 px-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Contact Us</h1>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <p className="text-gray-600">Contact form will be added here.</p>
        </div>
      </main>
    </div>
  );
};

export default Contact;
