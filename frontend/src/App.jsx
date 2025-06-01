import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import Dashboard from './pages/Dashboard';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Search from './pages/Search';
import Layout from './components/layout/Layout';
import PrivateRoute from './components/PrivateRoute';
import PostForm from './components/posts/PostForm';

function App() {
  return (
    <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/post/:slug" element={<PostDetail />} />
            <Route path="/search/:query" element={<Search />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/dashboard" element={
              <PrivateRoute requiredRole="editor">
                <Dashboard />
              </PrivateRoute>
            } />
            
            <Route path="/create-post" element={
              <PrivateRoute requiredRole="editor">
                <PostForm />
              </PrivateRoute>
            } />
            
            <Route path="/edit-post/:id" element={
              <PrivateRoute requiredRole="editor">
                <PostForm />
              </PrivateRoute>
            } />
          </Routes>
        </Layout>
    </AuthProvider>
  );
}

export default App;