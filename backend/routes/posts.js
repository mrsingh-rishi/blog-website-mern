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

// Public routes
router.get('/', getAllPosts);
router.get('/:slug', getPostBySlug);
router.get('/search/:query', async (req, res) => {
  const results = await searchPosts(req.params.query);
  res.json(results);
});

// Protected routes
router.use(auth);

// Editor+ routes
router.post('/', roles('editor', 'admin'), createPost);
router.put('/:id', roles('editor', 'admin'), updatePost);
router.delete('/:id', roles('editor', 'admin'), deletePost);

module.exports = router;