# Use Node.js base image
FROM node:20

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the service's code
COPY . .

# Build the application
RUN npm run build:api-gateway

RUN npx prisma generate && npx prisma db push

# Expose the port (set per service)
EXPOSE 3000

# Start the application
CMD ["node", "dist/apps/api-gateway/main.js"]