
# ViewInSpotify Chrome Extension

## Description

ViewInSpotify is a Chrome extension that allows you to find Spotify links for songs you are playing in YouTube videos. This repository contains both the extension and a Node.js backend.

## Prerequisites

Before you begin, make sure:
- You have installed Node.js and npm.
- You have a modern web browser such as Chrome.
- You have access to your Google API and Spotify API credentials.

## Installation

To install ViewInSpotify, follow these steps:

### Cloning the Repository

```bash
git clone https://github.com/YaySushi/view-in-spotify.git
cd view-in-spotify
```

### Setting Up the Backend

Navigate to the backend directory and install dependencies:

```bash
cd server
npm install
```

## Configuration

**Set up the environment variables for the backend:**

   Create a `.env` file in the `server` directory and add your API keys:

   ```plaintext
   YOUTUBE_API_KEY=your_youtube_api_key_here
   SPOTIFY_CLIENT_ID=your_spotify_client_id_here
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
   ```

## Running the Project

### Starting the Backend Server

In the `server` directory, run:

```bash
npm start
```

This starts the backend server on `http://localhost:3001`.

### Loading the Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable Developer Mode at the top right.
3. Click "Load unpacked" and select the `view-in-spotify` directory.

## Using the Extension

Navigate to a YouTube video with music, click the extension icon, and use the popup to find the song on Spotify.
