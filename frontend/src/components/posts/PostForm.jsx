import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Editor from '../ui/Editor';
import ImageUploader from '../ui/ImageUploader';
import { useNavigate, useParams } from 'react-router-dom';

const PostForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(!!id);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  useEffect(() => {
    if (id) {
      setLoading(true);
      axios.get(`${API_URL}/api/posts/${id}`)
        .then(res => {
          const post = res.data;
          setTitle(post.title || '');
          setContent(post.content || '');
          setTags(post.tags ? post.tags.join(', ') : '');
          setFeaturedImage(post.featuredImage || '');
        })
        .catch(err => {
          console.error('Error fetching post:', err);
        })
        .finally(() => setLoading(false));
    }
  }, [id, API_URL]);

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
      if (id) {
        await axios.put(`${API_URL}/api/posts/${id}`, postData);
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

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 mt-10 space-y-8"
      style={{ fontFamily: 'Georgia, serif' }}
    >
      <div className="flex flex-col items-center">
        <ImageUploader onUpload={setFeaturedImage} />
        {featuredImage && (
          <img
            src={featuredImage}
            alt="Featured"
            className="h-64 w-full object-cover rounded-lg mt-4 shadow"
          />
        )}
      </div>

      <input
        type="text"
        id="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        placeholder="Title"
        className="w-full text-4xl font-bold border-0 focus:ring-0 outline-none placeholder-gray-400 mb-2 bg-transparent"
        style={{ resize: 'none' }}
        autoFocus
      />

      <Editor
        value={content}
        onChange={setContent}
        placeholder="Tell your story..."
        className="min-h-[300px] text-lg"
      />

      <input
        type="text"
        id="tags"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Add tags (comma separated)"
        className="w-full border-0 border-b border-gray-200 focus:border-black focus:ring-0 text-base py-2 bg-transparent"
      />

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-black text-white px-8 py-3 rounded-full font-semibold shadow hover:bg-gray-900 transition disabled:opacity-60"
          style={{ fontFamily: 'inherit', fontSize: '1.1rem' }}
        >
          {isSubmitting ? 'Saving...' : 'Publish'}
        </button>
      </div>
    </form>
  );
};

export default PostForm;