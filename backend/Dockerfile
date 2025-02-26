# Use an official Node.js runtime as the base image.
FROM --platform=linux/amd64 node:18


# Set the working directory in the container to /app.
WORKDIR /app

# Copy package.json and package-lock.json (if available) into the container.
COPY package*.json ./

# Install the dependencies inside the container.
RUN npm install

# Copy the rest of your application code into the container.
COPY . .

# Expose the port on which your app runs (adjust if your app uses a different port).
EXPOSE 3000

# Define the command to run your app.
CMD ["node", "server.js"]
