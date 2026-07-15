#!/bin/bash
# =========================================================
#  DarshanEase - One-Command Setup Script (macOS / Linux)
#  This script will:
#   1. Install backend dependencies
#   2. Create backend .env (if missing)
#   3. Seed the database with sample temples/slots/admin
#   4. Start the backend server
#   5. Install frontend dependencies
#   6. Create frontend .env (if missing)
#   7. Start the frontend React app
# =========================================================

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}=========================================${NC}"
echo -e "${YELLOW}   DarshanEase - Automated Setup Script  ${NC}"
echo -e "${YELLOW}=========================================${NC}"

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

# ---------- Check prerequisites ----------
if ! command -v node &> /dev/null; then
  echo -e "${RED}Node.js is not installed. Please install Node.js v16+ first.${NC}"
  exit 1
fi
if ! command -v npm &> /dev/null; then
  echo -e "${RED}npm is not installed. Please install npm first.${NC}"
  exit 1
fi

echo -e "${GREEN}Node version:${NC} $(node -v)"
echo -e "${GREEN}npm version:${NC} $(npm -v)"

# ---------- Backend Setup ----------
echo -e "\n${YELLOW}Step 1: Installing backend dependencies...${NC}"
cd "$BACKEND_DIR"
npm install

if [ ! -f ".env" ]; then
  echo -e "${YELLOW}Creating backend .env from .env.example...${NC}"
  cp .env.example .env
  echo -e "${GREEN}Created backend/.env - edit it if you need a custom MongoDB URI.${NC}"
else
  echo -e "${GREEN}backend/.env already exists, skipping.${NC}"
fi

echo -e "\n${YELLOW}Step 2: Checking MongoDB connection...${NC}"
echo "Make sure MongoDB is running locally (mongod) or your Atlas URI in .env is correct."
read -p "Press ENTER once MongoDB is ready to continue..."

echo -e "\n${YELLOW}Step 3: Seeding sample temples, slots, and admin user...${NC}"
npm run seed || echo -e "${RED}Seeding failed - check your MongoDB connection in backend/.env${NC}"

echo -e "\n${YELLOW}Step 4: Starting backend server (http://localhost:5000)...${NC}"
npm run dev &
BACKEND_PID=$!
echo -e "${GREEN}Backend running with PID $BACKEND_PID${NC}"

sleep 3

# ---------- Frontend Setup ----------
echo -e "\n${YELLOW}Step 5: Installing frontend dependencies...${NC}"
cd "$FRONTEND_DIR"
npm install

if [ ! -f ".env" ]; then
  echo -e "${YELLOW}Creating frontend .env from .env.example...${NC}"
  cp .env.example .env
else
  echo -e "${GREEN}frontend/.env already exists, skipping.${NC}"
fi

echo -e "\n${YELLOW}Step 6: Starting frontend (http://localhost:3000)...${NC}"
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN} Backend:  http://localhost:5000${NC}"
echo -e "${GREEN} Frontend: http://localhost:3000${NC}"
echo -e "${GREEN} Admin login: admin@darshanease.com / Admin@123${NC}"
echo -e "${GREEN}=========================================${NC}"
echo -e "${YELLOW}Press CTRL+C to stop both servers.${NC}\n"

# Trap to kill backend when frontend (or script) exits
trap "echo -e '\n${YELLOW}Stopping backend server...${NC}'; kill $BACKEND_PID 2>/dev/null" EXIT

npm start
