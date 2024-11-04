#!/bin/bash
# This script will be executed as the container's entrypoint

# Exit immediately if a command exits with a non-zero status
set -e

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py migrate


# Start the server
echo "Starting server..."
exec "$@"
