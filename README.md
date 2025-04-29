# Recap - Collaborative Recaps tool for all companies sizes

Recap is a collaborative update tracking system designed to help teams share notes and stay organized. This repository contains the frontend application built with React, TypeScript, and Vite.

## Note :
I only exposed this repo for Interviewing purposes only, I'm launching this product soon, the backend repo is still private.
## Features

- **Team Management**: Create, update, and delete teams with member management
- **Roles & Permissions Management**: Create, update, and delete roles and permissions to be used on team members
- **Recaps**: Write, consult, and organize Recaps across team members
- **Secure Authentication**: JWT-based authentication with role-based access control
- **Email Verification**: Secure account creation with email verification
- **Interactive API Docs**: Built-in API documentation powered by RapiDoc (In backend Repo only)

## Coming Soon
- Cross team collaboration tools
- Ability for members to interact with recaps
- ClickUp & Trello Integrations
- AI recap refinement tools ( quickplan.blueblood.tech integration )

Pre-Beta Screenshot (has some missing data)
[image](https://github.com/user-attachments/assets/386642b9-a615-4870-b84a-420c0735a6d7)
)
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
