# User Guide - GitTrend Analyzer

This guide provides instructions on how to run, manage, and use the GitTrend Analyzer application.

## Prerequisites

- **Rust:** Ensure `cargo` is installed (for the backend).
- **Node.js:** Ensure `npm` is installed (for the frontend).

## Service Management

A unified management script `manage.sh` is provided in the root directory to control both services simultaneously.

### Starting the Services
To start both the Rust backend and Next.js frontend in the background:
```bash
./manage.sh start
```
*Wait approximately 10-15 seconds for the frontend to fully initialize.*

### Checking Status
To see if the services are listening on their respective ports (4000 and 4001):
```bash
./manage.sh status
```

### Health Check
To verify that the API is responding and the frontend is serving content:
```bash
./manage.sh health
```

### Stopping the Services
To gracefully terminate both services:
```bash
./manage.sh stop
```

### Restarting
To refresh both services:
```bash
./manage.sh restart
```

## Using the Application

1.  **Access the Dashboard:** Open your browser and go to `http://localhost:4000`.
2.  **Filter by Time Range:** Use the sidebar to switch between `Today`, `This Week`, and `This Month`. This triggers a fresh scrape from GitHub via the Rust backend.
3.  **Filter by Language:** Filter the current results by specific programming languages (Python, Rust, JS, etc.) using the radio buttons in the sidebar.
4.  **View Analysis:**
    - **Language Distribution:** Check the bar chart at the top to see which languages are currently dominating the trends.
    - **AI Summary:** Read the dynamic summary box for a quick overview of the top-performing project and overall activity.
5.  **Explore Repositories:** Click on any repository card to visit its owner and project details (note: "View on GitHub" links in cards lead to the respective GitHub pages).
6.  **Refresh Data:** Click the **"Scrape Daily"** button in the header at any time to force a fresh data fetch from GitHub.

## Troubleshooting

- **Port Conflicts:** Ensure ports `4000` and `4001` are not being used by other applications.
- **Backend Logs:** Check `backend.log` in the root for scraper errors or API issues.
- **Frontend Logs:** Check `frontend.log` in the root for compilation errors or hydration issues.
- **Dependency Issues:** If services fail to start, try running `cargo build` in `backend/` and `npm install` in `frontend/` manually.
