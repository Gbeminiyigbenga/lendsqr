# Base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy environment and package files
COPY .env.example .env
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

# Expose port
EXPOSE 3000

# Run app
CMD ["npm", "run", "start:prod"]
