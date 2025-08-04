# MERN Stack Blog Application

[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=19958790&assignment_repo_type=AssignmentRepo)

A full-stack blog application built with MongoDB, Express.js, React.js, and Node.js demonstrating seamless front-end and back-end integration with modern web development practices.

## 🚀 Features

- **Full CRUD Operations**: Create, read, update, and delete blog posts
- **User Authentication**: Secure registration and login system with JWT
- **Image Uploads**: Upload and manage featured images for blog posts
- **Category Management**: Organize posts by categories
- **Comments System**: Interactive commenting on blog posts
- **Search & Filter**: Advanced search and filtering capabilities
- **Responsive Design**: Mobile-first responsive UI
- **Real-time Updates**: Optimistic UI updates for better UX
- **Pagination**: Efficient loading of large datasets

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library with hooks and context
- **Vite** - Fast build tool and dev server
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Form validation and management

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Multer** - File upload middleware
- **Joi** - Data validation library
- **bcryptjs** - Password hashing

## 📂 Project Structure

```
mern-blog/
├── client/                 # React front-end
│   ├── public/             # Static files
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src/                # React source code
│   │   ├── components/     # Reusable components
│   │   │   ├── common/     # Common UI components
│   │   │   ├── layout/     # Layout components
│   │   │   └── forms/      # Form components
│   │   ├── pages/          # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── PostDetail.jsx
│   │   │   ├── CreatePost.jsx
│   │   │   ├── EditPost.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── hooks/          # Custom React hooks
│   │   │   ├── useAuth.js
│   │   │   ├── usePosts.js
│   │   │   └── useApi.js
│   │   ├── services/       # API services
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   └── postService.js
│   │   ├── context/        # React context providers
│   │   │   ├── AuthContext.jsx
│   │   │   └── PostContext.jsx
│   │   ├── utils/          # Utility functions
│   │   │   ├── helpers.js
│   │   │   └── constants.js
│   │   ├── styles/         # Global styles
│   │   │   └── index.css
│   │   ├── App.jsx         # Main application component
│   │   └── main.jsx        # Application entry point
│   ├── package.json        # Client dependencies
│   ├── vite.config.js      # Vite configuration
│   ├── tailwind.config.js  # Tailwind CSS configuration
│   └── .env.example        # Environment variables template
├── server/                 # Express.js back-end
│   ├── config/             # Configuration files
│   │   ├── database.js     # MongoDB connection
│   │   ├── cloudinary.js   # Image upload configuration
│   │   └── jwt.js          # JWT configuration
│   ├── controllers/        # Route controllers
│   │   ├── authController.js
│   │   ├── postController.js
│   │   ├── categoryController.js
│   │   └── commentController.js
│   ├── models/             # Mongoose models
│   │   ├── User.js
│   │   ├── Post.js
│   │   ├── Category.js
│   │   └── Comment.js
│   ├── routes/             # API routes
│   │   ├── auth.js
│   │   ├── posts.js
│   │   ├── categories.js
│   │   └── comments.js
│   ├── middleware/         # Custom middleware
│   │   ├── auth.js         # Authentication middleware
│   │   ├── validation.js   # Input validation
│   │   ├── errorHandler.js # Error handling
│   │   └── upload.js       # File upload middleware
│   ├── utils/              # Utility functions
│   │   ├── helpers.js
│   │   └── validation.js
│   ├── uploads/            # Uploaded files directory
│   ├── server.js           # Main server file
│   ├── package.json        # Server dependencies
│   └── .env.example        # Environment variables template
├── .gitignore              # Git ignore rules
├── .env.example            # Root environment variables
└── README.md               # Project documentation
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd mern-blog
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Set up environment variables**
   
   Create `.env` files in both server and client directories based on the `.env.example` files:
   
   **Server (.env)**
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/mern-blog
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=7d
   CLOUDINARY_CLOUD_NAME=your-cloudinary-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   ```
   
   **Client (.env)**
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

5. **Start the development servers**
   
   **Terminal 1 - Server:**
   ```bash
   cd server
   npm run dev
   ```
   
   **Terminal 2 - Client:**
   ```bash
   cd client
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Posts Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/posts` | Get all posts | No |
| GET | `/api/posts/:id` | Get single post | No |
| POST | `/api/posts` | Create new post | Yes |
| PUT | `/api/posts/:id` | Update post | Yes (Owner) |
| DELETE | `/api/posts/:id` | Delete post | Yes (Owner) |

### Categories Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/categories` | Get all categories | No |
| POST | `/api/categories` | Create category | Yes |
| PUT | `/api/categories/:id` | Update category | Yes |
| DELETE | `/api/categories/:id` | Delete category | Yes |

### Comments Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/posts/:postId/comments` | Get post comments | No |
| POST | `/api/posts/:postId/comments` | Add comment | Yes |
| PUT | `/api/comments/:id` | Update comment | Yes (Owner) |
| DELETE | `/api/comments/:id` | Delete comment | Yes (Owner) |

## 🎨 Screenshots

### Home Page
![Home Page](./screenshots/home.png)

### Post Detail
![Post Detail](./screenshots/post-detail.png)

### Create Post
![Create Post](./screenshots/create-post.png)

### Login Page
![Login](./screenshots/login.png)

## 🧪 Testing

### Running Tests

**Server Tests:**
```bash
cd server
npm test
```

**Client Tests:**
```bash
cd client
npm test
```

### API Testing with Postman

Import the Postman collection from `./docs/postman-collection.json` to test all API endpoints.

## 🚀 Deployment

### Backend Deployment (Heroku)

1. Create a Heroku app
2. Set environment variables in Heroku dashboard
3. Deploy using Git:
   ```bash
   git subtree push --prefix server heroku main
   ```

### Frontend Deployment (Netlify)

1. Build the client:
   ```bash
   cd client
   npm run build
   ```
2. Deploy the `dist` folder to Netlify

### Database (MongoDB Atlas)

1. Create a MongoDB Atlas cluster
2. Update `MONGODB_URI` in environment variables
3. Whitelist your deployment IP addresses

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- MongoDB documentation and community
- Express.js documentation
- React.js documentation
- Node.js documentation
- All open-source contributors

## 📞 Support

If you have any questions or need help, please:
- Open an issue in this repository
- Contact the development team
- Check the documentation in the `/docs` folder

---

**Built with ❤️ using the MERN Stack**
