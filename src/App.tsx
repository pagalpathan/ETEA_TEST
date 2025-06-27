import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Practice from './pages/Practice';
import AdminPage from './pages/Admin'; // Import the Admin page

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/auth" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<AdminPage />} /> {/* Add Admin route */}
          <Route path="/" element={<Layout />}>
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/practice" element={
              <ProtectedRoute>
                <Practice />
              </ProtectedRoute>
            } />
            <Route path="/mock-tests" element={
              <ProtectedRoute>
                <div className="p-8 text-center">
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">Mock Tests</h1>
                  <p className="text-gray-600">Coming soon! Full-length ETEA mock tests with timer and detailed analysis.</p>
                </div>
              </ProtectedRoute>
            } />
            <Route path="/past-papers" element={
              <ProtectedRoute>
                <div className="p-8 text-center">
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">Past Papers</h1>
                  <p className="text-gray-600">Coming soon! Year-wise solved ETEA past papers.</p>
                </div>
              </ProtectedRoute>
            } />
            <Route path="/bookmarks" element={
              <ProtectedRoute>
                <div className="p-8 text-center">
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">Bookmarks</h1>
                  <p className="text-gray-600">Coming soon! Your bookmarked questions for quick review.</p>
                </div>
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;