# Use official Node.js LTS image
FROM node:20-alpine as builder

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm install --production=false

# Copy the rest of the application code
COPY . .

# Build the NestJS app
RUN npm run build

# Production image
FROM node:20-alpine as production
WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Cloud Run expects the app to listen on $PORT
ENV PORT=8080

# Expose the port
EXPOSE 8080

# Start the app
CMD ["node", "dist/main.js"]
