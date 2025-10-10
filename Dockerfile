# Stage 1: Build the React application
FROM node:20-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the application with a production server
FROM node:20-alpine

WORKDIR /app

# Copy package.json, package-lock.json, and the server script
COPY package.json package-lock.json server.cjs ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy the build output from the build stage
COPY --from=build /app/build ./build

# Expose the port the app runs on
EXPOSE 3000

# Command to run the server
CMD ["npm", "start"]