FROM node:16-alpine

# Install mysql-client for testing connections inside the container (optional)
RUN apk add --no-cache mysql-client

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the backend app will use
EXPOSE 5000

# Define the command to run the backend app
CMD ["node", "server.js"]
