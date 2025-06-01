const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const roles = require('../middlewares/roles');
const { 
  createPost, 
  getAllPosts, 
  getPostBySlug, 
  updatePost, 
  deletePost 
} = require('../controllers/postController');
const { searchPosts } = require('../services/elasticsearch');
const Post = require('../models/Post');

// Public routes
router.get('/', getAllPosts);
router.get('/:slug', getPostBySlug);
router.get('/search/:query', async (req, res) => {
  try {
    const query = req.params.query;
    // Simple text search in title and content fields
    const results = await Post.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } }
      ]
    });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Protected routes
router.use(auth);

// Editor+ routes
router.post('/', roles('editor', 'admin'), createPost);
router.put('/:id', roles('editor', 'admin'), updatePost);
router.delete('/:id', roles('editor', 'admin'), deletePost);

module.exports = router;