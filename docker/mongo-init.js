// MongoDB initialization script
db = db.getSiblingDB('mern-blog');

// Create collections
db.createCollection('users');
db.createCollection('posts');
db.createCollection('categories');
db.createCollection('comments');

// Create indexes
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "username": 1 }, { unique: true });
db.posts.createIndex({ "title": "text", "content": "text", "excerpt": "text" });
db.posts.createIndex({ "slug": 1 }, { unique: true });
db.posts.createIndex({ "status": 1, "publishedAt": -1 });
db.categories.createIndex({ "slug": 1 }, { unique: true });
db.comments.createIndex({ "post": 1, "createdAt": -1 });

// Insert default categories
db.categories.insertMany([
  {
    name: "Technology",
    slug: "technology",
    description: "Latest in tech trends and innovations",
    color: "#3b82f6",
    icon: "monitor",
    isActive: true,
    sortOrder: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Lifestyle",
    slug: "lifestyle",
    description: "Tips and insights for better living",
    color: "#10b981",
    icon: "heart",
    isActive: true,
    sortOrder: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Business",
    slug: "business",
    description: "Business strategies and insights",
    color: "#f59e0b",
    icon: "briefcase",
    isActive: true,
    sortOrder: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

print('Database initialized successfully!');
