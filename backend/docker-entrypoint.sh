#!/bin/bash
# This script will be executed as the container's entrypoint

# Exit immediately if a command exits with a non-zero status
set -e

# Run migrations
echo "Running migrations..."
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Start the server
echo "Starting server..."
exec "$@"
