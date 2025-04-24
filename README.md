# Premium Auto Sales Platform

A modern full-stack car sales platform built with Next.js, TypeScript, Tailwind CSS, Node.js, and MongoDB.

## Features

### For Buyers
- Modern, responsive interface
- Advanced car search with multiple filters
- Real-time inventory updates
- Seasonal promotions and deals
- Favorite cars and save searches
- Mobile-first design

### For Owner/Admin
- Secure admin dashboard
- Easy car listing management
- Photo upload and management
- Sales metrics and analytics
- Lead management system
- Promotional tools

## Tech Stack

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- React Query
- Framer Motion

### Backend
- Node.js
- Express
- MongoDB
- JWT Authentication
- Cloudinary (image hosting)

## Getting Started

1. Clone the repository
```bash
git clone [repository-url]
cd premium-auto-sales
```

2. Install dependencies
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. Set up environment variables
```bash
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name

# Backend (.env)
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. Run the development servers
```bash
# Frontend (http://localhost:3000)
cd frontend
npm run dev

# Backend (http://localhost:3001)
cd backend
npm run dev
```

## Project Structure

```
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── public/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── middleware/
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 