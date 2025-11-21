#!/bin/bash

# Setup script for Playwright tests
# This script helps set up everything needed to run Playwright tests

set -e  # Exit on error

echo "========================================="
echo "Playwright Test Setup Script"
echo "========================================="
echo ""

# Step 1: Install npm dependencies
echo "Step 1: Installing npm dependencies..."
if [ ! -d "node_modules" ]; then
    echo "  → Running npm install..."
    npm install
else
    echo "  ✓ node_modules already exists, skipping npm install"
fi
echo ""

# Step 2: Install Playwright browsers
echo "Step 2: Installing Playwright browsers..."
if ! npx playwright --version &> /dev/null; then
    echo "  → Playwright not found, installing..."
    npm install --save-dev @playwright/test
fi

echo "  → Installing Chromium browser..."
npx playwright install chromium
echo ""

# Step 3: Check for .env file
echo "Step 3: Checking environment configuration..."
if [ ! -f ".env" ]; then
    echo "  ⚠ Warning: .env file not found!"
    echo "  → Creating .env file with default values..."
    cat > .env << 'EOF'
MONGODB_URI=mongodb://localhost:27017/loginapp
JWT_SECRET=your_secret_key_here_change_in_production
JWT_REFRESH_SECRET=your_refresh_secret_key_here_change_in_production
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
PORT=5000
EOF
    echo "  ✓ .env file created with default values"
    echo "  ⚠ Remember to update JWT secrets for production!"
else
    echo "  ✓ .env file exists"
fi
echo ""

# Step 4: Check MongoDB
echo "Step 4: Checking MongoDB..."
if command -v mongod &> /dev/null; then
    echo "  ✓ MongoDB is installed"
    if pgrep -x "mongod" > /dev/null; then
        echo "  ✓ MongoDB is running"
    else
        echo "  ⚠ Warning: MongoDB is not running"
        echo "  → Start MongoDB with: mongod"
    fi
else
    echo "  ⚠ Warning: MongoDB not found in PATH"
    echo "  → Install MongoDB: https://www.mongodb.com/docs/manual/installation/"
fi
echo ""

echo "========================================="
echo "Setup Complete!"
echo "========================================="
echo ""
echo "To run Playwright tests:"
echo "  1. Start the backend:  npm run server  (in terminal 1)"
echo "  2. Start the frontend: npm start       (in terminal 2)"
echo "  3. Run tests:          npx playwright test (in terminal 3)"
echo ""
echo "Or run tests with headed browser:"
echo "  npx playwright test --headed"
echo ""
