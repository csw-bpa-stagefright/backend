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
RUN npm run build:billing

RUN npx prisma generate && npx prisma db push

# Expose the port (set per service)
EXPOSE 3001

# Start the application
CMD ["node", "dist/apps/billing/main.js"]