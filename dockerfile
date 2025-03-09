# Use an official Node.js runtime as a parent image
FROM node:20 AS build

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Use a lightweight web server to serve the built files
FROM node:20-alpine

WORKDIR /app

# Copy the built files from the build stage
COPY --from=build /app/dist ./dist

# Install a simple http server
RUN npm install -g serve

EXPOSE 3000

# Start
CMD ["serve", "-s", "dist", "-l", "3000"]
