
# Video Streaming Application

This is a full-stack web application that fetches and displays real videos from external sources.

## Features

- Fetches real videos from external sources
- Responsive video grid layout
- Video detail page with embedded player
- Loading states and error handling
- Toast notifications

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express
- **Libraries**: TanStack Query, Axios, Cheerio, Sonner

## Getting Started

### Prerequisites

- Node.js (v16 or newer)
- npm or yarn

### Setup

1. Clone the repository

```bash
git clone <repository-url>
cd <repository-folder>
```

2. Install dependencies for both frontend and backend

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### Running the Application

#### Option 1: Run the backend and frontend separately

1. Start the backend server

```bash
# In the server directory
cd server
npm install (first time only)
npm start
```

2. Start the frontend application

```bash
# In the root directory, in a separate terminal
npm run dev
```

#### Option 2: Run both services together

You can use our convenience script to start both the backend and frontend at once:

```bash
# Install dependencies first (if you haven't already)
cd server && npm install
cd ..

# Start both services
node start-app.js
```

3. Open your browser and navigate to http://localhost:8080

## API Endpoints

- `GET /api/videos` - Fetch videos from all sources
- `GET /api/videos/:source/:id` - Fetch a specific video by ID and source

## Error Handling

The application handles various error scenarios:

- API request failures
- Video loading errors
- Invalid routes

Errors are displayed using toast notifications with retry options where appropriate.

## Notes

- The backend proxies requests to video sources to avoid CORS issues
- No videos are actually stored in this application; only metadata and embed URLs
- The application uses the public RSS feeds and HTML structure of source websites, which may change over time

## License

This project is for educational purposes only. Please respect the terms of service of the content sources.
