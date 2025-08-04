const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Please provide comment content'],
    trim: true,
    maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    minlength: [1, 'Comment must have content']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Comment must have an author'],
    index: true
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: [true, 'Comment must belong to a post'],
    index: true
  },
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },
  isApproved: {
    type: Boolean,
    default: true
  },
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: {
    type: Date,
    default: null
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
  isReported: {
    type: Boolean,
    default: false
  },
  reportCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for reply count
commentSchema.virtual('replyCount', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'parentComment',
  count: true,
  match: { isApproved: true }
});

// Virtual for like count
commentSchema.virtual('likeCount').get(function() {
  return this.likes ? this.likes.length : 0;
});

// Virtual for formatted date
commentSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

// Indexes for better query performance
commentSchema.index({ post: 1, createdAt: -1 });
commentSchema.index({ author: 1, createdAt: -1 });
commentSchema.index({ parentComment: 1, createdAt: 1 });
commentSchema.index({ isApproved: 1 });

// Pre-save middleware to set editedAt when comment is modified
commentSchema.pre('save', function(next) {
  if (this.isModified('content') && !this.isNew) {
    this.isEdited = true;
    this.editedAt = new Date();
  }
  next();
});

// Static method to find approved comments for a post
commentSchema.statics.findByPost = function(postId, options = {}) {
  const {
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = -1,
    includeReplies = false
  } = options;

  const query = {
    post: postId,
    isApproved: true,
    parentComment: includeReplies ? undefined : null
  };

  // Remove undefined values
  Object.keys(query).forEach(key => 
    query[key] === undefined && delete query[key]
  );

  return this.find(query)
    .populate('author', 'username firstName lastName avatar')
    .populate({
      path: 'parentComment',
      select: 'author content createdAt',
      populate: {
        path: 'author',
        select: 'username firstName lastName'
      }
    })
    .sort({ [sortBy]: sortOrder })
    .limit(limit * 1)
    .skip((page - 1) * limit);
};

// Static method to find replies for a comment
commentSchema.statics.findReplies = function(commentId) {
  return this.find({
    parentComment: commentId,
    isApproved: true
  })
    .populate('author', 'username firstName lastName avatar')
    .sort({ createdAt: 1 });
};

// Static method to get comment statistics for a post
commentSchema.statics.getPostStats = function(postId) {
  return this.aggregate([
    {
      $match: {
        post: mongoose.Types.ObjectId(postId),
        isApproved: true
      }
    },
    {
      $group: {
        _id: null,
        totalComments: { $sum: 1 },
        totalLikes: { $sum: { $size: '$likes' } },
        lastCommentDate: { $max: '$createdAt' }
      }
    }
  ]);
};

// Instance method to toggle like
commentSchema.methods.toggleLike = function(userId) {
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

// Instance method to check if user liked the comment
commentSchema.methods.isLikedBy = function(userId) {
  return this.likes.some(like => 
    like.user.toString() === userId.toString()
  );
};

// Instance method to report comment
commentSchema.methods.report = function() {
  this.reportCount += 1;
  this.isReported = true;
  return this.save();
};

// Instance method to approve comment
commentSchema.methods.approve = function() {
  this.isApproved = true;
  return this.save();
};

// Instance method to reject comment
commentSchema.methods.reject = function() {
  this.isApproved = false;
  return this.save();
};

// Pre-remove middleware to handle nested comments
commentSchema.pre('remove', async function(next) {
  try {
    // Remove all replies to this comment
    await this.model('Comment').deleteMany({ parentComment: this._id });
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Comment', commentSchema);
