import React from 'react';
import Header from '@/components/organisms/Header';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pb-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;