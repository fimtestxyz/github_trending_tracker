# GitTrend Analyzer

GitTrend Analyzer is a high-performance web application designed to scrape, categorize, and visualize GitHub's trending repositories. It provides a modern, interactive dashboard to explore the most popular projects on GitHub across different time ranges and programming languages.

## Project Specifications

### Backend (Rust)
- **Framework:** [Axum](https://github.com/tokio-rs/axum) for the REST API.
- **Scraper:** [Scraper](https://github.com/causal-agent/scraper) and [Reqwest](https://github.com/seanmonstar/reqwest) for parsing GitHub's HTML structure.
- **Features:** 
    - Real-time scraping of `github.com/trending`.
    - Support for `daily`, `weekly`, and `monthly` time ranges.
    - CORS-enabled API for frontend communication.
    - Optimized logging with `tracing-subscriber`.

### Frontend (Next.js)
- **Framework:** Next.js 14+ (App Router, TypeScript).
- **Styling:** Tailwind CSS for a modern, dark-themed responsive UI.
- **Visuals:** [Chart.js](https://www.chartjs.org/) for language distribution analysis.
- **Icons:** [Lucide React](https://lucide.dev/).
- **Features:**
    - Interactive Sidebar for time range and language filtering.
    - AI-style summary panel (calculated dynamically).
    - Responsive repo grid with detailed metadata cards.
    - Skeleton loading states for smooth UX.

## Project Structure

```text
github_trending/
├── backend/                # Rust API & Scraper
│   ├── src/
│   │   └── main.rs         # Scraper logic and Axum routes
│   └── Cargo.toml          # Rust dependencies
├── frontend/               # Next.js Application
│   ├── app/                # App Router (pages & layout)
│   ├── components/         # React components (Dashboard, Sidebar, etc.)
│   ├── types/              # TypeScript interfaces
│   └── package.json        # Node.js dependencies
├── manage.sh               # Unified service management script
├── .gitignore              # Project-wide git exclusions
├── README.md               # Project specifications and structure
└── USERGUIDE.md            # Usage and operation manual
```

## Technical Ports
- **Frontend:** `http://localhost:4000`
- **Backend API:** `http://localhost:4001`

---
Developed as a high-performance prototype for tracking open-source trends.
