import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { Search, TrendingUp, Clock, User, MessageCircle, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

import { postService } from '../services/postService';
import { categoryService } from '../services/categoryService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import PostCard from '../components/posts/PostCard';
import CategoryBadge from '../components/categories/CategoryBadge';
import SearchBox from '../components/common/SearchBox';
import { formatDate } from '../utils/helpers';

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch featured posts
  const { 
    data: featuredPosts, 
    isLoading: loadingFeatured,
    error: featuredError 
  } = useQuery(
    'featured-posts',
    () => postService.getFeatured({ limit: 3 }),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  // Fetch recent posts
  const { 
    data: recentPosts, 
    isLoading: loadingRecent,
    error: recentError 
  } = useQuery(
    ['posts', { page: 1, limit: 6, category: selectedCategory, search: searchTerm }],
    () => postService.getAll({ 
      page: 1, 
      limit: 6, 
      ...(selectedCategory && { category: selectedCategory }),
      ...(searchTerm && { search: searchTerm })
    }),
    {
      keepPreviousData: true,
    }
  );

  // Fetch categories
  const { 
    data: categories, 
    isLoading: loadingCategories 
  } = useQuery(
    'categories',
    categoryService.getAll
  );

  const handleCategoryFilter = (categoryId) => {
    setSelectedCategory(categoryId === selectedCategory ? '' : categoryId);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  if (loadingFeatured && loadingRecent && loadingCategories) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section 
        className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Welcome to Our Blog
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl mb-8 text-primary-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Discover amazing stories, insights, and ideas from our community
          </motion.p>
          
          {/* Search Box */}
          <motion.div 
            className="max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <SearchBox 
              onSearch={handleSearch}
              placeholder="Search articles..."
              className="bg-white text-gray-900"
            />
          </motion.div>
        </div>
      </motion.section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Posts Section */}
        {featuredPosts?.data?.length > 0 && (
          <motion.section 
            className="mb-16"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              className="flex items-center mb-8"
              variants={itemVariants}
            >
              <TrendingUp className="h-6 w-6 text-primary-600 mr-2" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Featured Posts
              </h2>
            </motion.div>

            {featuredError ? (
              <ErrorMessage message="Failed to load featured posts" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredPosts.data.map((post, index) => (
                  <motion.div
                    key={post._id}
                    variants={itemVariants}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <PostCard 
                      post={post} 
                      featured={true}
                      priority={index === 0}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.section>
        )}

        {/* Categories Filter */}
        {categories?.data?.length > 0 && (
          <motion.section 
            className="mb-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h3 
              className="text-lg font-semibold text-gray-900 dark:text-white mb-4"
              variants={itemVariants}
            >
              Filter by Category
            </motion.h3>
            <motion.div 
              className="flex flex-wrap gap-2"
              variants={itemVariants}
            >
              <button
                onClick={() => handleCategoryFilter('')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === ''
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                All Categories
              </button>
              {categories.data.map((category) => (
                <button
                  key={category._id}
                  onClick={() => handleCategoryFilter(category._id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category._id
                      ? 'text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                  style={selectedCategory === category._id ? { backgroundColor: category.color } : {}}
                >
                  {category.name}
                </button>
              ))}
            </motion.div>
          </motion.section>
        )}

        {/* Recent Posts Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="flex items-center justify-between mb-8"
            variants={itemVariants}
          >
            <div className="flex items-center">
              <Clock className="h-6 w-6 text-primary-600 mr-2" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                {searchTerm ? 'Search Results' : selectedCategory ? 'Category Posts' : 'Recent Posts'}
              </h2>
            </div>
            
            {!searchTerm && !selectedCategory && (
              <Link 
                to="/posts"
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                View All Posts →
              </Link>
            )}
          </motion.div>

          {recentError ? (
            <ErrorMessage message="Failed to load posts" />
          ) : loadingRecent ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-300 dark:bg-gray-700 h-48 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : recentPosts?.data?.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
            >
              {recentPosts.data.map((post) => (
                <motion.div
                  key={post._id}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <PostCard post={post} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              className="text-center py-16"
              variants={itemVariants}
            >
              <div className="text-gray-400 dark:text-gray-600 mb-4">
                <Search className="h-16 w-16 mx-auto mb-4" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {searchTerm 
                  ? 'No posts found for your search' 
                  : selectedCategory 
                    ? 'No posts in this category yet'
                    : 'No posts available'
                }
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchTerm 
                  ? 'Try adjusting your search terms or browse all posts'
                  : 'Check back later for new content'
                }
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Clear Search
                </button>
              )}
            </motion.div>
          )}

          {/* Pagination */}
          {recentPosts?.pagination?.totalPages > 1 && (
            <motion.div 
              className="flex justify-center mt-12"
              variants={itemVariants}
            >
              <Link
                to={`/posts?${new URLSearchParams({
                  ...(selectedCategory && { category: selectedCategory }),
                  ...(searchTerm && { search: searchTerm })
                }).toString()}`}
                className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                View All Posts
              </Link>
            </motion.div>
          )}
        </motion.section>

        {/* Stats Section */}
        <motion.section 
          className="mt-20 py-16 bg-gray-50 dark:bg-gray-800 rounded-2xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <div className="max-w-4xl mx-auto px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
              Join Our Growing Community
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-6"
              >
                <div className="bg-primary-100 dark:bg-primary-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {recentPosts?.pagination?.totalPosts || 0}+
                </h3>
                <p className="text-gray-600 dark:text-gray-400">Published Articles</p>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-6"
              >
                <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {categories?.data?.length || 0}+
                </h3>
                <p className="text-gray-600 dark:text-gray-400">Categories</p>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-6"
              >
                <div className="bg-red-100 dark:bg-red-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  1000+
                </h3>
                <p className="text-gray-600 dark:text-gray-400">Happy Readers</p>
              </motion.div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default Home;
