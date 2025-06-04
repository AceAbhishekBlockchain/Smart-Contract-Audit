# Stage 1: Build
FROM node:18 AS builder

# Set working directory
WORKDIR /app

# Copy package.json and lock file
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the source
COPY . .

# Build the app
RUN npm run build

# Stage 2: Serve with 'serve'
FROM node:18 AS runner

# Install static file server
RUN npm install -g serve

# Set working directory
WORKDIR /app

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 8080

# Start server
CMD ["serve", "-s", "dist", "-l", "8080"]
