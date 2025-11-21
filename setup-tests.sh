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
# Check if @playwright/test is installed by checking package.json and node_modules
if [ -d "node_modules/@playwright/test" ]; then
    echo "  ✓ @playwright/test is already installed"
else
    echo "  ⚠ @playwright/test not found, please run 'npm install' first"
fi

echo "  → Installing Chromium browser..."
npx playwright install chromium
echo ""

# Step 3: Check for .env file
echo "Step 3: Checking environment configuration..."
if [ ! -f ".env" ]; then
    echo "  ⚠ Warning: .env file not found!"
    echo "  → Creating .env file with default values..."
    
    # Generate random JWT secrets for better security
    JWT_SECRET=$(openssl rand -base64 32 2>/dev/null || echo "INSECURE_DEFAULT_PLEASE_CHANGE_ME_$(date +%s)")
    JWT_REFRESH_SECRET=$(openssl rand -base64 32 2>/dev/null || echo "INSECURE_REFRESH_DEFAULT_PLEASE_CHANGE_ME_$(date +%s)")
    
    cat > .env << EOF
MONGODB_URI=mongodb://localhost:27017/loginapp
JWT_SECRET=${JWT_SECRET}
JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
PORT=5000
EOF
    echo "  ✓ .env file created with randomly generated JWT secrets"
    echo "  ℹ️  For production, consider using even stronger secrets"
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
