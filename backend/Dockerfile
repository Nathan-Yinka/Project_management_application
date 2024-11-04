# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory in the container
WORKDIR /app

# Install dependencies
COPY requirements.txt /app/
RUN pip install -r requirements.txt

# Copy the rest of the application code to the working directory
COPY . /app/

# Copy the entrypoint script and give execution permission
COPY docker-entrypoint.sh /app/
RUN chmod +x /app/docker-entrypoint.sh

# Expose the port the app runs on
EXPOSE 8000

# Use the entrypoint script to run the application
ENTRYPOINT ["/app/docker-entrypoint.sh"]

# Default command to run the application
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "core.wsgi:application", "--workers", "4"]
