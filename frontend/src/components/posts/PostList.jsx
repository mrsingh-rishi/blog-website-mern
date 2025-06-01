import React from 'react';
import PostItem from './PostItem';

const PostList = ({ posts = [], showActions = false }) => {
  const safePosts = Array.isArray(posts) ? posts : [];

  if (!safePosts || safePosts.length === 0) {
    return <p>No posts available.</p>;
  }

  return (
    <div className="space-y-6">
      {safePosts.map(post => (
        <PostItem key={post._id} post={post} showActions={showActions} />
      ))}
    </div>
  );
};

export default PostList;