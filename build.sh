#!/bin/bash

# Install dependencies in the root
npm install

# Build frontend
cd frontend
npm install
npm run build
cd ..

# Build backend
cd backend
npm install
cd ..

# Copy frontend build to the right location
mkdir -p frontend/dist
cp -r frontend/dist/* frontend/dist/

echo "Build completed" 