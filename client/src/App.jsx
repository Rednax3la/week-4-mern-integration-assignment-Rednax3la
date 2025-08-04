import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { PostProvider } from './context/PostContext';

// Layout Components
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import Categories from './pages/Categories';
import CategoryPosts from './pages/CategoryPosts';
import Search from './pages/Search';
import NotFound from './pages/NotFound';

// Error Boundary
import ErrorBoundary from './components/common/ErrorBoundary';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <PostProvider>
            <Router>
              <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Layout>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/post/:slug" element={<PostDetail />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/category/:slug" element={<CategoryPosts />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected Routes */}
                    <Route path="/create-post" element={
                      <ProtectedRoute>
                        <CreatePost />
                      </ProtectedRoute>
                    } />
                    <Route path="/edit-post/:id" element={
                      <ProtectedRoute>
                        <EditPost />
                      </ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    } />

                    {/* 404 Route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Layout>

                {/* Toast Notifications */}
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: '#363636',
                      color: '#fff',
                    },
                    success: {
                      duration: 3000,
                      theme: {
                        primary: '#10b981',
                        secondary: 'black',
                      },
                    },
                    error: {
                      duration: 5000,
                      theme: {
                        primary: '#ef4444',
                        secondary: 'black',
                      },
                    },
                  }}
                />
              </div>
            </Router>
          </PostProvider>
        </AuthProvider>

        {/* React Query DevTools */}
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
