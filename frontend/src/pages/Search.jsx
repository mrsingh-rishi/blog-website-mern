import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PostList from '../components/posts/PostList';

const Search = () => {
  const { query } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  useEffect(() => {
    const searchPosts = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/posts/search/${query}`);
        setPosts(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    searchPosts();
  }, [query]);

  if (loading) {
    return <div className="flex justify-center mt-8">Searching posts...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Search Results for "{query}"</h1>
      {posts.length > 0 ? (
        <PostList posts={posts} />
      ) : (
        <p>No posts found matching your query.</p>
      )}
    </div>
  );
};

export default Search;