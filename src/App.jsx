import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from '@/components/organisms/Layout';
import Home from '@/components/pages/Home';
import Browse from '@/components/pages/Browse';
import PropertyDetail from '@/components/pages/PropertyDetail';
import OwnerDashboard from '@/components/pages/OwnerDashboard';
import CustomerDashboard from '@/components/pages/CustomerDashboard';
import Plans from '@/components/pages/Plans';
import ListProperty from '@/components/pages/ListProperty';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/property/:id" element={<PropertyDetail />} />
            <Route path="/owner-dashboard" element={<OwnerDashboard />} />
            <Route path="/customer-dashboard" element={<CustomerDashboard />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/list-property" element={<ListProperty />} />
          </Routes>
        </Layout>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{ zIndex: 9999 }}
        />
      </div>
    </Router>
  );
}

export default App;