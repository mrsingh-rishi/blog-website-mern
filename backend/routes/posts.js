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
router.get("/:id", roles('editor', 'admin'), async (req, res) => {
  console.log('GET /:id called with id:', req.params.id);
  try {
    const post = await Post.findOne({_id: req.params.id});
    console.log('Post found:', post);
    if (!post) {
      console.log('Post not found for id:', req.params.id);
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.json(post);
  } catch (err) {
    console.error('Error fetching post by id:', err.message);
    res.status(500).send('Server error');
  }
});
router.post('/', roles('editor', 'admin'), createPost);
router.put('/:id', roles('editor', 'admin'), updatePost);
router.delete('/:id', roles('editor', 'admin'), deletePost);

module.exports = router;