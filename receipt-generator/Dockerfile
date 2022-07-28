ARG PORT=3000

FROM node:18-alpine AS node

# Builder stage

FROM node AS builder

# Use /app as the CWD
WORKDIR /app            

# Copy package.json and package-lock.json to /app
COPY package*.json ./   

# Install all dependencies
RUN npm i               

# Copy the rest of the code
COPY . .                

# Invoke the build script to transpile ts code to js
RUN npm run build    

# Open desired port
EXPOSE ${PORT}

# Run development server
ENTRYPOINT [ "npm", "run", "dev" ]

# Final stage

FROM node AS final

# Set node environment to production
ENV NODE_ENV production
ENV DB_DIR /home/node/database

# Update the system
RUN apk --no-cache -U upgrade

# Prepare destination directory and ensure user node owns it
RUN mkdir -p /home/node/app/dist 
RUN mkdir -p /home/node/app/public/config
RUN mkdir -p /home/node/database
RUN chown -R node:node /home/node/app
RUN chown -R node:node /home/node/database

# Set CWD
WORKDIR /home/node/app

# Install PM2
RUN npm i -g pm2

# Install chromium
RUN apk add chromium

# Copy package.json, package-lock.json and process.yml
COPY package*.json process.yml ./

# Switch to user node
USER node

# Install libraries as user node
RUN npm i --only=production

# Copy js files and change ownership to user node
COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node --from=builder /app/api ./api
COPY --chown=node:node --from=builder /app/public/config ./public/config

# Open desired port
EXPOSE ${PORT}

# Use PM2 to run the application as stated in config file
ENTRYPOINT ["pm2-runtime", "./process.yml"] 
