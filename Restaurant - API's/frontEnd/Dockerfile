FROM nginx:alpine

# Copy the static files to the container's web root directory.
COPY index.html /usr/share/nginx/html/
COPY styles.css /usr/share/nginx/html/
COPY scripts.js /usr/share/nginx/html/

# Expose port 80 (default port for Nginx)
EXPOSE 80