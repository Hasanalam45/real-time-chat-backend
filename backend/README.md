# Real-Time Chat Application - Backend

A clean, well-organized Node.js backend for a real-time chat application built with Express, Socket.IO, MongoDB, and Cloudinary.

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/              # Configuration files
│   │   ├── env.config.js    # Environment variables configuration
│   │   ├── constants.js     # Application constants
│   │   └── index.js         # Config exports
│   ├── controllers/         # Request handlers
│   │   ├── auth.controller.js
│   │   └── message.controller.js
│   ├── services/            # Business logic layer
│   │   ├── auth.service.js
│   │   ├── message.service.js
│   │   └── cloudinary.service.js
│   ├── routes/              # API routes
│   │   ├── auth.routes.js
│   │   └── message.routes.js
│   ├── models/              # Database models
│   │   ├── user.model.js
│   │   └── message.model.js
│   ├── middlewares/         # Express middlewares
│   │   ├── auth.middleware.js
│   │   └── error.middleware.js
│   ├── validators/          # Request validation schemas
│   │   └── auth.validator.js
│   ├── utils/               # Utility functions
│   │   ├── response.util.js
│   │   ├── jwt.util.js
│   │   └── index.js
│   ├── lib/                 # External service integrations
│   │   ├── database.js      # MongoDB connection
│   │   └── socket.js        # Socket.IO setup
│   ├── seeds/               # Database seed scripts
│   │   └── user.seed.js
│   ├── app.js               # Express app configuration
│   └── index.js             # Application entry point
├── ENV_SETUP.md             # Environment variables documentation
├── package.json
├── vercel.json              # Vercel deployment configuration
└── README.md                # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v22.x or higher)
- MongoDB (local or MongoDB Atlas)
- Cloudinary account (for image uploads)

### Installation

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:

   - Copy the template from `ENV_SETUP.md`
   - Create a `.env` file in the `backend/` directory
   - Fill in all required variables (see `ENV_SETUP.md` for details)

3. Start the development server:

```bash
npm run dev
```

4. Seed the database (optional):

```bash
node src/seeds/user.seed.js
```

## 📝 Environment Variables

See `ENV_SETUP.md` for detailed documentation on all environment variables.

**Required variables:**

- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret

## 🏗️ Architecture

### Separation of Concerns

The codebase follows a clean architecture pattern:

1. **Controllers** - Handle HTTP requests/responses
2. **Services** - Contain business logic
3. **Models** - Define database schemas
4. **Routes** - Define API endpoints
5. **Middlewares** - Handle cross-cutting concerns (auth, errors)
6. **Validators** - Validate request data
7. **Utils** - Reusable utility functions
8. **Config** - Centralized configuration

### Key Features

- ✅ Centralized configuration management
- ✅ Proper error handling with custom middleware
- ✅ JWT-based authentication with HTTP-only cookies
- ✅ Real-time messaging with Socket.IO
- ✅ Image uploads via Cloudinary
- ✅ Input validation with Joi
- ✅ Consistent API response format
- ✅ Clean, readable, and maintainable code

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/user-info` - Get current user info (protected)
- `GET /api/auth/check-auth` - Check authentication status (protected)
- `PUT /api/auth/update-profile` - Update profile picture (protected)

### Message Routes (`/api/message`)

- `GET /api/message/users` - Get all users for sidebar (protected)
- `GET /api/message/:id` - Get messages with a user (protected)
- `POST /api/message/send/:id` - Send a message to a user (protected)

## 🛠️ Development

### Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Code Style

- Use ES6+ syntax
- Follow existing naming conventions (kebab-case for files, camelCase for variables)
- Add JSDoc comments for functions
- Keep functions small and focused

## 🧪 Testing

The application includes error handling and validation. All endpoints return consistent JSON responses:

```json
{
  "error": false,
  "message": "Success message",
  "data": { ... }
}
```

## 📦 Deployment

The application is configured for Vercel deployment. The `vercel.json` file is already set up.

## 🔒 Security

- Passwords are hashed using bcrypt
- JWT tokens stored in HTTP-only cookies
- CORS configured for allowed origins
- Input validation on all endpoints
- Environment variables for sensitive data

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Socket.IO Documentation](https://socket.io/docs/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Cloudinary Documentation](https://cloudinary.com/documentation)

## 🤝 Contributing

When contributing, please:

1. Follow the existing code structure
2. Add appropriate comments and documentation
3. Ensure error handling is in place
4. Test your changes thoroughly

## 📄 License

ISC
