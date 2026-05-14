#!/bin/bash

# Configuration
BACKEND_PORT=4001
FRONTEND_PORT=4000
BACKEND_DIR="./backend"
FRONTEND_DIR="./frontend"
PID_FILE=".service_pids"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

function start() {
    echo "Starting services..."
    
    # Check if already running
    if [ -f $PID_FILE ]; then
        echo -e "${RED}Services appear to be running. Stop them first or remove $PID_FILE.${NC}"
        return
    fi

    # Start Backend
    echo "Starting Backend on port $BACKEND_PORT..."
    cd $BACKEND_DIR && cargo run --quiet > ../backend.log 2>&1 &
    BACKEND_PID=$!
    echo $BACKEND_PID > ../$PID_FILE

    # Start Frontend
    echo "Starting Frontend on port $FRONTEND_PORT..."
    cd $FRONTEND_DIR && npm run dev -- -p $FRONTEND_PORT > ../frontend.log 2>&1 &
    FRONTEND_PID=$!
    echo $FRONTEND_PID >> ../$PID_FILE

    echo -e "${GREEN}Services started in background.${NC}"
    echo "Logs: backend.log, frontend.log"
}

function stop() {
    echo "Stopping services..."
    if [ -f $PID_FILE ]; then
        while read pid; do
            if kill -0 $pid 2>/dev/null; then
                kill $pid
                echo "Killed process $pid"
            fi
        done < $PID_FILE
        rm $PID_FILE
        echo -e "${GREEN}Services stopped.${NC}"
    else
        echo -e "${RED}No PID file found. Services might not be running.${NC}"
        # Fallback: kill by port
        lsof -ti :$BACKEND_PORT | xargs kill -9 2>/dev/null
        lsof -ti :$FRONTEND_PORT | xargs kill -9 2>/dev/null
    fi
}

function status() {
    echo "Checking service status..."
    
    # Backend
    if lsof -Pi :$BACKEND_PORT -sTCP:LISTEN -t >/dev/null ; then
        echo -e "Backend ($BACKEND_PORT): ${GREEN}RUNNING${NC}"
    else
        echo -e "Backend ($BACKEND_PORT): ${RED}STOPPED${NC}"
    fi

    # Frontend
    if lsof -Pi :$FRONTEND_PORT -sTCP:LISTEN -t >/dev/null ; then
        echo -e "Frontend ($FRONTEND_PORT): ${GREEN}RUNNING${NC}"
    else
        echo -e "Frontend ($FRONTEND_PORT): ${RED}STOPPED${NC}"
    fi
}

function health() {
    echo "Performing health checks..."
    
    # Backend check
    BE_STATUS=$(curl -o /dev/null -s -w "%{http_code}" http://localhost:$BACKEND_PORT/api/trending?since=daily)
    if [ "$BE_STATUS" == "200" ]; then
        echo -e "Backend API: ${GREEN}HEALTHY (200 OK)${NC}"
    else
        echo -e "Backend API: ${RED}UNHEALTHY ($BE_STATUS)${NC}"
    fi

    # Frontend check
    FE_STATUS=$(curl -o /dev/null -s -w "%{http_code}" http://localhost:$FRONTEND_PORT)
    if [ "$FE_STATUS" == "200" ]; then
        echo -e "Frontend App: ${GREEN}HEALTHY (200 OK)${NC}"
    else
        echo -e "Frontend App: ${RED}UNHEALTHY ($FE_STATUS)${NC}"
    fi
}

case "$1" in
    start)
        start
        ;;
    stop)
        stop
        ;;
    status)
        status
        ;;
    health)
        health
        ;;
    restart)
        stop
        sleep 2
        start
        ;;
    *)
        echo "Usage: $0 {start|stop|status|health|restart}"
        exit 1
esac
