import React from 'react';
import { Link } from 'react-router-dom';

const PostItem = ({ post, showActions }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {post.featuredImage && (
        <img 
          src={post.featuredImage} 
          alt={post.title} 
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-6">
        <Link to={`/post/${post.slug}`} className="text-xl font-bold hover:text-primary">
          {post.title}
        </Link>
        <div className="text-gray-600 mt-2">
          By {post.author?.username || 'Unknown'} • {new Date(post.createdAt).toLocaleDateString()}
        </div>
        <div className="mt-3">
          {post.tags?.map(tag => (
            <span key={tag} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
              #{tag}
            </span>
          ))}
        </div>
        {showActions && (
          <div className="mt-4 flex space-x-3">
            <Link 
              to={`/edit-post/${post._id}`}
              className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
            >
              Edit
            </Link>
            <button className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostItem;