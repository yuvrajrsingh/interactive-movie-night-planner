# 🎬 Interactive Movie Night Planner

An interactive movie discovery and planning web app powered by **The Movie Database (TMDB) API**.

Browse popular movies, search for specific titles, filter and sort results, maintain a personal watchlist, mark movies as watched, and view detailed movie information — all from a clean, responsive interface.

## ✨ Features

- 🎥 Browse popular movies
- 🔎 Search for movies by title
- 🎭 Filter movies by genre
- ⭐ Filter movies by minimum rating
- 👀 Filter movies by watched/unwatched status
- ↕️ Sort movies by:
  - Rating
  - Release year
  - Title
- ❤️ Add and remove movies from a watchlist
- ✅ Mark movies as watched/unwatched
- 🌑 Visually distinguish watched movies
- 🎲 Pick a random movie from the currently visible results
- 📋 View detailed movie information in a modal
- 💾 Persist watchlist and watched movies using `localStorage`
- 🖼️ Display movie posters and fallback images when unavailable
- 🔐 API requests are handled through a serverless Cloudflare Worker so the TMDB API token isn't exposed in the frontend

## 🛠️ Technologies

- HTML
- CSS
- JavaScript
- TMDB API
- Cloudflare Workers
- LocalStorage

## 📁 Project Structure

```text
interactive-movie-night-planner/
│
├── index.html
├── style.css
├── script.js
│
├── public/
│   └── no-image-poster.png
│
└── README.md
