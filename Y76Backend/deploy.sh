#!/bin/bash

# Echo current directory to verify it's correct
echo "Deploying from directory: $(pwd)"

# Install dependencies
echo "Installing dependencies..."
npm install

# Attempt to stop any running instance of the application
echo "Attempting to stop existing application..."
pm2 stop todo-api || echo "No existing process found. Continuing deployment..."

# Attempt to delete any existing PM2 process
echo "Attempting to delete existing process..."
pm2 delete todo-api || echo "No process to delete. Continuing deployment..."

# Start the application with PM2
echo "Starting the application..."
pm2 start app.js --name "todo-api"

# Save the PM2 process list
echo "Saving PM2 process list..."
pm2 save

echo "Deployment complete."
