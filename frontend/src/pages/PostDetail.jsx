import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PostDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/posts/${slug}`);
        setPost(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return <div className="flex justify-center mt-8">Loading post...</div>;
  }

  if (!post) {
    return <div className="max-w-4xl mx-auto py-8">Post not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <div className="text-gray-600 mb-4">
        By {post.author?.username || 'Unknown'} • {new Date(post.createdAt).toLocaleDateString()}
      </div>
      
      {post.featuredImage && (
        <img 
          src={post.featuredImage} 
          alt={post.title} 
          className="w-full h-96 object-cover rounded-lg mb-6"
        />
      )}
      
      <div 
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }} 
      />
    </div>
  );
};

export default PostDetail;