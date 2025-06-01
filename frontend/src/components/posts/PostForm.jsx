import React, { useState } from 'react';
import axios from 'axios';
import Editor from '../ui/Editor';
import ImageUploader from '../ui/ImageUploader';
import { useNavigate } from 'react-router-dom';

const PostForm = ({ post }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.content || '');
  const [tags, setTags] = useState(post?.tags?.join(', ') || '');
  const [featuredImage, setFeaturedImage] = useState(post?.featuredImage || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const postData = {
      title,
      content,
      tags,
      featuredImage
    };

    try {
      if (post) {
        await axios.put(`${API_URL}/api/posts/${post._id}`, postData);
      } else {
        await axios.post(`${API_URL}/api/posts`, postData);
      }
      navigate('/dashboard');
    } catch (err) {
      console.error('Error saving post:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
        />
      </div>

      <ImageUploader onUpload={setFeaturedImage} />
      {featuredImage && (
        <div>
          <img 
            src={featuredImage} 
            alt="Featured" 
            className="h-40 object-cover rounded-md"
          />
        </div>
      )}

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
          Content
        </label>
        <Editor value={content} onChange={setContent} />
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
          Tags (comma separated)
        </label>
        <input
          type="text"
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex justify-center py-2 px-4 border border-gray-700 shadow-sm text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
      >
        {isSubmitting ? 'Saving...' : 'Save Post'}
      </button>
    </form>
  );
};

export default PostForm;