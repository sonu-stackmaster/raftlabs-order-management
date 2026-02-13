# Food Delivery Order Management System

A production-quality full-stack Order Management system for a food delivery app with real-time order tracking.

## 🚀 Features

- **Menu Management**: Browse and display food items
- **Shopping Cart**: Add/remove items with quantity management
- **Order Placement**: Complete checkout with customer information
- **Real-time Order Tracking**: Live status updates via Socket.io
- **Automated Status Progression**: Orders automatically progress through statuses
- **Responsive Design**: Mobile-first responsive UI
- **Production Ready**: Full TypeScript, error handling, logging, and testing

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Zustand** for state management
- **React Router** for navigation
- **React Hook Form** for form handling
- **Tailwind CSS** for styling
- **Socket.io Client** for real-time updates
- **Axios** for API calls

### Backend
- **Node.js** with Express and TypeScript
- **MongoDB Atlas** with Mongoose ODM
- **Socket.io** for real-time communication
- **Winston** for logging
- **Joi** for validation
- **Helmet** for security
- **CORS** for cross-origin requests

### Testing
- **Jest** and **Supertest** for backend testing
- **Vitest** and **React Testing Library** for frontend testing

## 📁 Project Structure

```
/
├── client/                 # React frontend
│   ├── src/
│   │   ├── api/           # API layer
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Zustand stores
│   │   ├── sockets/       # Socket.io client
│   │   ├── types/         # TypeScript types
│   │   └── test/          # Test setup
│   └── package.json
├── server/                # Node.js backend
│   ├── src/
│   │   ├── config/        # Database and environment config
│   │   ├── models/        # Mongoose models
│   │   ├── repositories/  # Data access layer
│   │   ├── services/      # Business logic
│   │   ├── controllers/   # Route handlers
│   │   ├── routes/        # API routes
│   │   ├── sockets/       # Socket.io handlers
│   │   ├── jobs/          # Background jobs
│   │   ├── middleware/    # Express middleware
│   │   └── utils/         # Utilities and constants
│   ├── tests/             # Test files
│   └── package.json
├── docker-compose.yml     # Docker configuration
├── .env.example          # Environment variables template
└── README.md
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account (or local MongoDB)
- Git

### 1. Clone the Repository

```bash
git clone <repository-url>
cd food-delivery-order-management
```

### 2. Environment Setup

Create environment files:

```bash
# Copy the example environment file
cp .env.example .env

# Edit the .env file with your MongoDB Atlas connection string
```

**Required Environment Variables:**

```env
# MongoDB Atlas Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/food-delivery?retryWrites=true&w=majority

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Origin
CORS_ORIGIN=http://localhost:5173
```

### 3. MongoDB Atlas Setup

1. Create a [MongoDB Atlas](https://www.mongodb.com/atlas) account
2. Create a new cluster
3. Create a database user with read/write permissions
4. Get your connection string and update `MONGODB_URI` in `.env`
5. Whitelist your IP address in Network Access

### 4. Install Dependencies

```bash
# Install root dependencies
npm run install:all

# Or install manually:
npm install
cd server && npm install
cd ../client && npm install
```

### 5. Seed Database (Optional)

Add some sample menu items to your database:

```bash
cd server
npm run seed  # If you create a seed script, or add items via API
```

### 6. Start Development Servers

```bash
# Start both frontend and backend concurrently
npm run dev

# Or start individually:
# Backend (http://localhost:5000)
npm run dev:server

# Frontend (http://localhost:5173)  
npm run dev:client
```

## 🧪 Testing

### Backend Tests

```bash
cd server
npm test
```

### Frontend Tests

```bash
cd client
npm test
```

### Run All Tests

```bash
npm test
```

## 🐳 Docker Deployment

```bash
# Start all services with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📡 API Endpoints

### Menu Endpoints

- `GET /api/menu` - Get all menu items
- `GET /api/menu/:id` - Get menu item by ID
- `POST /api/menu` - Create new menu item

### Order Endpoints

- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order by ID
- `GET /api/orders` - Get all orders

### Health Check

- `GET /health` - Server health status

## 🔄 Order Status Flow

Orders automatically progress through these statuses:

1. **Order Received** (Initial status)
2. **Preparing** (After 5 seconds)
3. **Out for Delivery** (After 10 seconds total)
4. **Delivered** (After 15 seconds total)

Real-time updates are sent via Socket.io to connected clients.

## 🔌 Socket.io Events

### Client Events

- `join-order` - Join order room for updates
- `leave-order` - Leave order room

### Server Events

- `order-status-updated` - Order status changed
- `joined-order` - Confirmation of joining order room

## 🏗 Architecture Patterns

### Backend Architecture

- **Repository Pattern**: Data access abstraction
- **Service Layer**: Business logic separation
- **Controller Layer**: HTTP request handling
- **Middleware**: Cross-cutting concerns
- **Clean Architecture**: Dependency inversion

### Frontend Architecture

- **Component-Based**: Reusable UI components
- **State Management**: Zustand for global state
- **API Layer**: Centralized API calls
- **Type Safety**: Full TypeScript coverage

## 🔒 Security Features

- **Helmet.js**: Security headers
- **CORS**: Cross-origin request protection
- **Input Validation**: Joi schema validation
- **Error Handling**: Centralized error management
- **Environment Variables**: Sensitive data protection

## 📊 Monitoring & Logging

- **Winston**: Structured logging
- **Morgan**: HTTP request logging
- **Error Tracking**: Comprehensive error handling
- **Health Checks**: Service monitoring endpoints

## 🚀 Production Deployment

### Environment Variables for Production

```env
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
PORT=5000
CORS_ORIGIN=https://your-frontend-domain.com
```

### Build for Production

```bash
# Build both frontend and backend
npm run build

# Start production server
cd server && npm start
```

### Deployment Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure production MongoDB URI
- [ ] Set up proper CORS origins
- [ ] Configure reverse proxy (nginx)
- [ ] Set up SSL certificates
- [ ] Configure logging aggregation
- [ ] Set up monitoring and alerts
- [ ] Configure backup strategies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

**MongoDB Connection Issues:**
- Verify your connection string in `.env`
- Check IP whitelist in MongoDB Atlas
- Ensure database user has proper permissions

**Socket.io Connection Issues:**
- Check CORS configuration
- Verify WebSocket support
- Check firewall settings

**Build Issues:**
- Clear node_modules and reinstall dependencies
- Check Node.js version compatibility
- Verify TypeScript configuration

### Getting Help

- Check the [Issues](https://github.com/your-repo/issues) page
- Review the troubleshooting section
- Contact the development team

## 🎯 Future Enhancements

- [ ] User authentication and authorization
- [ ] Payment integration
- [ ] Order history and tracking
- [ ] Restaurant management dashboard
- [ ] Push notifications
- [ ] Advanced analytics and reporting
- [ ] Multi-restaurant support
- [ ] Delivery tracking with maps