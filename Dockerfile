# Base image
FROM node:22

# Create app directory
WORKDIR /app

# Install PM2 globally
RUN npm install -g pm2

# Copy both apps into container
COPY . /app

RUN rm -f /app/.env
RUN rm -rf /app/dist
RUN rm -rf /app/node_modules
RUN rm -rf /app/client/dist
RUN rm -rf /app/client/node_modules


# Install dependencies for API
WORKDIR /app
RUN npm run install:all

# Go back to root
WORKDIR /app

RUN npm run build


WORKDIR /app/gateway
RUN npm install

WORKDIR /app/
# Copy PM2 ecosystem config
COPY ./ecosystem.config.js .

EXPOSE 3000

# Use PM2 to run both apps
CMD ["pm2-runtime", "ecosystem.config.js"]
