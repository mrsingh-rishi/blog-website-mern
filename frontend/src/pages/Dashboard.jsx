import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PostList from '../components/posts/PostList';

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';


  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/posts`);
        setPosts(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div className="flex justify-center mt-8">Loading dashboard...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link 
          to="/create-post" 
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
          style={{ backgroundColor: '#2563eb', color: '#fff' }} // Ensures button is visible on white
        >
          Create Post
        </Link>
      </div>
      <PostList posts={posts} showActions={true} />
    </div>
  );
};

export default Dashboard;