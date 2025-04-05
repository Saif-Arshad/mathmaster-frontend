
import React from 'react';
import Header from '@/components/Header';
import { Mail } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-sky-100">
      <Header />
      <main className="ml-64 pt-8 mx-auto px-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Contact Us</h1>
        <div className="bg-white p-8  mx-auto rounded-xl shadow-md max-w-2xl">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="bg-mathpath-purple bg-opacity-20 p-6 rounded-full">
              <Mail size={48} className="text-mathpath-purple" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800">Get in Touch</h2>
            
            <p className="text-gray-600 max-w-md">
              If you have any questions or feedback about MathMaster, please feel free 
              to reach out to us. We're here to help children with dyscalculia learn math in a fun way!
            </p>
            
            <div className="bg-mathpath-lightPurple py-4 px-8 rounded-lg mt-4">
              <p className="text-mathpath-purple font-medium text-lg">
                math@master.com
              </p>
            </div>
            
            <p className="text-gray-500 text-sm">
              We typically respond within 1-2 business days.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;
