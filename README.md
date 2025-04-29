# Recap - Collaborative Update Tracking System

Recap is a collaborative update tracking system designed to help teams share notes and stay organized. This repository contains the frontend application built with React, TypeScript, and Vite.

## Features

- **Team Management**: Create, update, and delete teams with member management
- **Update Tracking**: Write, share, and organize notes across team members
- **Secure Authentication**: JWT-based authentication with role-based access control
- **Email Verification**: Secure account creation with email verification
- **Interactive API Docs**: Built-in API documentation powered by RapiDoc

## Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- ESLint (TypeScript-aware linting)

### Backend

- Node.js
- Express
- MongoDB
- JWT Authentication

## Development Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_API_BASE_URL=http://localhost:3000
```

## Scripts

- `dev`: Start development server
- `build`: Build for production
- `lint`: Run ESLint
- `preview`: Preview production build

## API Documentation

The backend API documentation is available at `/api-docs` when running the backend server.

## Contributing

Contributions are welcome! Please follow the standard GitHub flow:

1. Fork the repository
2. Create a feature branch
3. Submit a pull request
