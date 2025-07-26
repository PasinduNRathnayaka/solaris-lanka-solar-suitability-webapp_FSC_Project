# Solar Energy Admin Panel - MERN Stack

A complete MERN stack application for managing solar energy calculations with model coefficients, variables, and location-specific data.

## Features

- **Model Coefficients Management**: Configure mathematical model parameters
- **Variables Management**: Add, edit, and delete calculation variables
- **Location Data**: Manage location-specific variable values
- **Analytics Dashboard**: View system statistics and performance metrics
- **Real-time PVOUT Calculation**: Calculate solar energy output based on location data

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Database**: MongoDB Atlas

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- Git

### Quick Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd solar-admin-panel
   ```

2. **Install all dependencies**
   ```bash
   npm run install-deps
   ```

3. **Set up environment variables**
   
   Create `backend/.env` file:
   ```env
   MONGODB_URI=mongodb+srv://test1:solar12345@cluster0.fp8iwqo.mongodb.net/solar_admin
   PORT=5000
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on http://localhost:5000
   - Frontend server on http://localhost:3000

## Manual Setup

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

### Model Coefficients
- `GET /api/coefficients` - Get current model coefficients
- `PUT /api/coefficients` - Update model coefficients

### Variables
- `GET /api/variables` - Get all variables
- `POST /api/variables` - Create new variable
- `PUT /api/variables/:id` - Update variable
- `DELETE /api/variables/:id` - Delete variable

### Locations
- `GET /api/locations` - Get all locations
- `GET /api/locations/:province/:district/:city` - Get specific location
- `POST /api/locations` - Create/update location data
- `DELETE /api/locations/:id` - Delete location

### Analytics
- `GET /api/analytics` - Get analytics data
- `PUT /api/analytics` - Update analytics
- `POST /api/analytics/increment-calculation` - Increment calculation count

## Database Schema

### ModelCoefficient
```javascript
{
  name: String (default: 'default'),
  beta0: Number,
  beta1: Number,
  beta2: Number,
  beta3: Number,
  beta4: Number,
  epsilon: Number,
  isActive: Boolean,
  timestamps: true
}
```

### Variable
```javascript
{
  name: String,
  unit: String,
  description: String,
  isActive: Boolean,
  order: Number,
  timestamps: true
}
```

### Location
```javascript
{
  province: String,
  district: String,
  city: String,
  variables: [{
    variableId: ObjectId (ref: Variable),
    value: Number
  }],
  calculatedPVOUT: Number,
  lastCalculated: Date,
  isActive: Boolean,
  timestamps: true
}
```

### Analytics
```javascript
{
  totalCalculations: Number,
  monthlyCalculations: Number,
  activeLocations: Number,
  modelAccuracy: Number,
  rSquaredScore: Number,
  rmse: Number,
  lastUpdated: Date,
  modelVersion: String,
  timestamps: true
}
```

## Usage

1. **Model Coefficients**: Configure the mathematical model parameters (β₀, β₁, β₂, β₃, β₄, ε)
2. **Variables**: Add variables like Solar Irradiance, Temperature, Humidity, Cloud Cover
3. **Location Data**: Select province, district, and city, then input variable values
4. **Analytics**: View system statistics and performance metrics

## Mathematical Model

The system uses the linear regression model:

```
PVOUT = β₀ + β₁x₁ + β₂x₂ + β₃x₃ + β₄x₄ + ε
```

Where:
- x₁ = Solar Irradiance
- x₂ = Temperature
- x₃ = Humidity
- x₄ = Cloud Cover
- β₀, β₁, β₂, β₃, β₄ = Model coefficients
- ε = Error term

## Development

### Project Structure
```
solar-admin-panel/
├── backend/                 # Express.js API server
│   ├── config/             # Database configuration
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   └── server.js           # Entry point
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── App.jsx         # Main App component
│   └── package.json
└── package.json            # Root package.json
```

### Adding New Features

1. **Backend**: Add new routes in `backend/routes/`, models in `backend/models/`
2. **Frontend**: Add new components in `frontend/src/components/`, update API calls in `frontend/src/services/api.js`

## Deployment

### Backend Deployment
1. Set production environment variables
2. Deploy to platforms like Heroku, Railway, or DigitalOcean
3. Update MongoDB connection string for production

### Frontend Deployment
1. Build the frontend: `cd frontend && npm run build`
2. Deploy to platforms like Vercel, Netlify, or serve statically
3. Update API base URL for production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For support, email your-email@example.com or create an issue in the repository.

## License

This project is licensed under the MIT License.
```

## Additional Scripts to Run

### Initialize the project (run these commands in order):

```bash
# 1. Create the project structure
mkdir solar-admin-panel
cd solar-admin-panel

# 2. Initialize root package.json
npm init -y

# 3. Install concurrently for running both servers
npm install -D concurrently

# 4. Create backend
mkdir backend
cd backend
npm init -y
npm install express mongoose cors dotenv bcryptjs jsonwebtoken
npm install -D nodemon

# 5. Create frontend
cd ..
mkdir frontend
cd frontend
npm create vite@latest . -- --template react
npm install axios lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 6. Return to root and install all dependencies
cd ..
npm run install-deps
```

### Start the application:

```bash
# Development mode (runs both frontend and backend)
npm run dev

# Or run separately:
# Backend only
npm run server

# Frontend only  
npm run client
```

This complete MERN stack implementation provides:

✅ **Full CRUD operations** for coefficients, variables, and locations
✅ **MongoDB integration** with proper schemas and relationships
✅ **RESTful API** with Express.js
✅ **Modern React frontend** with hooks and component architecture
✅ **Real-time PVOUT calculations** 
✅ **Analytics dashboard** with system metrics
✅ **Responsive design** with Tailwind CSS
✅ **Error handling** and loading states
✅ **Development and production setup**

