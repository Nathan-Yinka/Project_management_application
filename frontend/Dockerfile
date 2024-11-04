# Development Dockerfile

# Use a Node.js image
FROM node:21

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --no-optional

# Copy the rest of the application files
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Run the development server
CMD ["npm", "run", "dev"]
