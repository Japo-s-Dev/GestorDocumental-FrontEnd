# Use the official nginx image as a base
FROM node:alpine

# Set working directory to nginx asset directory
WORKDIR /src/app

# Remove default nginx static assets
RUN npm install -g @angular/cli

#RUN npm install

# Run Nginx in the foreground
CMD ["ng", "serve", "--host", "0.0.0.0"]
