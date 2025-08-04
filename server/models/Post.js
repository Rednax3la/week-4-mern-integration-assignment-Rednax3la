const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
    minlength: [5, 'Title must be at least 5 characters long']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    index: true
  },
  content: {
    type: String,
    required: [true, 'Please provide content'],
    minlength: [50, 'Content must be at least 50 characters long']
  },
  excerpt: {
    type: String,
    maxlength: [300, 'Excerpt cannot exceed 300 characters']
  },
  featuredImage: {
    url: {
      type: String,
      default: null
    },
    public_id: {
      type: String,
      default: null
    },
    alt: {
      type: String,
      default: ''
    }
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Post must have an author'],
    index: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Post must have a category'],
    index: true
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
    index: true
  },
  publishedAt: {
    type: Date,
    default: null
  },
  readTime: {
    type: Number, // in minutes
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isEditorsPick: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  allowComments: {
    type: Boolean,
    default: true
  },
  seoMetadata: {
    title: {
      type: String,
      maxlength: [60, 'SEO title cannot exceed 60 characters']
    },
    description: {
      type: String,
      maxlength: [160, 'SEO description cannot exceed 160 characters']
    },
    keywords: [{
      type: String,
      lowercase: true
    }]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for comment count
postSchema.virtual('commentCount', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'post',
  count: true
});

// Virtual for like count
postSchema.virtual('likeCount').get(function() {
  return this.likes ? this.likes.length : 0;
});

// Virtual for formatted date
postSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Virtual for reading time calculation
postSchema.virtual('estimatedReadTime').get(function() {
  if (this.content) {
    const wordsPerMinute = 200;
    const wordCount = this.content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }
  return 0;
});

// Indexes for better query performance
postSchema.index({ title: 'text', content: 'text', excerpt: 'text' });
postSchema.index({ status: 1, publishedAt: -1 });
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ category: 1, publishedAt: -1 });
postSchema.index({ tags: 1 });
postSchema.index({ views: -1 });
postSchema.index({ 'likes.user': 1 });

// Generate slug before saving
postSchema.pre('save', function(next) {
  if (this.isModified('title') || this.isNew) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .trim() + '-' + Date.now();
  }
  next();
});

// Generate excerpt from content if not provided
postSchema.pre('save', function(next) {
  if (this.isModified('content') && !this.excerpt) {
    // Remove HTML tags and get first 150 characters
    const plainText = this.content.replace(/<[^>]*>/g, '');
    this.excerpt = plainText.substring(0, 150) + '...';
  }
  next();
});

// Set published date when status changes to published
postSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// Calculate and update read time before saving
postSchema.pre('save', function(next) {
  if (this.isModified('content')) {
    const wordsPerMinute = 200;
    const wordCount = this.content.split(/\s+/).length;
    this.readTime = Math.ceil(wordCount / wordsPerMinute);
  }
  next();
});

// Static method to find published posts
postSchema.statics.findPublished = function() {
  return this.find({ status: 'published' })
    .populate('author', 'username firstName lastName avatar')
    .populate('category', 'name slug')
    .sort({ publishedAt: -1 });
};

// Static method to find featured posts
postSchema.statics.findFeatured = function() {
  return this.find({ status: 'published', isFeatured: true })
    .populate('author', 'username firstName lastName avatar')
    .populate('category', 'name slug')
    .sort({ publishedAt: -1 });
};

// Static method to find posts by category
postSchema.statics.findByCategory = function(categoryId) {
  return this.find({ status: 'published', category: categoryId })
    .populate('author', 'username firstName lastName avatar')
    .populate('category', 'name slug')
    .sort({ publishedAt: -1 });
};

// Static method to search posts
postSchema.statics.searchPosts = function(query) {
  return this.find({
    status: 'published',
    $text: { $search: query }
  }, {
    score: { $meta: 'textScore' }
  })
    .populate('author', 'username firstName lastName avatar')
    .populate('category', 'name slug')
    .sort({ score: { $meta: 'textScore' } });
};

// Instance method to increment views
postSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Instance method to toggle like
postSchema.methods.toggleLike = function(userId) {
  const existingLike = this.likes.find(like => 
    like.user.toString() === userId.toString()
  );

  if (existingLike) {
    // Remove like
    this.likes = this.likes.filter(like => 
      like.user.toString() !== userId.toString()
    );
  } else {
    // Add like
    this.likes.push({ user: userId });
  }

  return this.save();
};

// Instance method to check if user liked the post
postSchema.methods.isLikedBy = function(userId) {
  return this.likes.some(like => 
    like.user.toString() === userId.toString()
  );
};

// Pre-remove middleware to clean up related data
postSchema.pre('remove', async function(next) {
  try {
    // Remove all comments for this post
    await this.model('Comment').deleteMany({ post: this._id });
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Post', postSchema);
