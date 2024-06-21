# Use the latest Node.js image as the base image
FROM node:20-alpine

# Create and set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port the app runs on (e.g., 3000)
EXPOSE 3000

# Run the application
CMD ["npm", "run", "start"]
