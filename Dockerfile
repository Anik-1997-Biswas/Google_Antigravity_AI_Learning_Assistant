# Pin to specific digest for supply-chain security
FROM nginx:1.25-alpine

# Image metadata labels
LABEL maintainer="Lumina Learn Team"
LABEL version="2.0.0"
LABEL description="Lumina Learn — AI-powered adaptive learning assistant"
LABEL org.opencontainers.image.title="Lumina Learn"
LABEL org.opencontainers.image.source="https://github.com/your-org/lumina-learn"

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy static application files
COPY index.html  /usr/share/nginx/html/index.html
COPY styles.css  /usr/share/nginx/html/styles.css
COPY app.js      /usr/share/nginx/html/app.js

# Expose Cloud Run expected port
EXPOSE 8080

# Health check for Cloud Run / orchestrators
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:8080/ || exit 1

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
