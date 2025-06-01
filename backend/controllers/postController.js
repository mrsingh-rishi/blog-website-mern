const Post = require('../models/Post');
// const { indexDocument } = require('../services/elasticsearch');

// Create post
exports.createPost = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

    const newPost = new Post({
      title,
      slug,
      content,
      tags: tags.split(',').map(tag => tag.trim()),
      author: req.user.id,
      featuredImage: req.body.featuredImage || ''
    });

    const post = await newPost.save();
    
    // Index in Elasticsearch
    // await indexDocument('posts', {
    //   id: post._id,
    //   title: post.title,
    //   content: post.content,
    //   tags: post.tags,
    //   slug: post.slug
    // });

    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get all posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'username').sort('-createdAt');
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get single post
exports.getPostBySlug = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug }).populate('author', 'username');
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update post
exports.updatePost = async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    // Check ownership or admin role
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    post = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    // Update Elasticsearch index
    // await indexDocument('posts', {
    //   id: post._id,
    //   title: post.title,
    //   content: post.content,
    //   tags: post.tags,
    //   slug: post.slug
    // }, true);

    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Delete post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    // Check ownership or admin role
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await post.remove();
    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};