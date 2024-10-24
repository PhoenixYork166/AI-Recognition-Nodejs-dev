# Using latest Node version
FROM node:latest
#FROM node:16-alpine

ARG TIME_ZONE=Asia/Hong_Kong
# Set environment variables for APT
ENV TZ=$TIME_ZONE
ENV LANG=C.UTF-8
ENV DEBIAN_FRONTEND=non-interactive
# We don't need the standalone Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Add libc6-compat package
#RUN apk --no-cache add libc6-compat

WORKDIR /app

COPY package.json .

# Set Container Linux env USER to ROOT
USER root

# Define build-time argument for hostname (optional)
ARG DEFAULT_HOSTNAME=ai-nodejs

# Use the hostname in some configuration file or script
RUN echo "Hostname of this Container: ${DEFAULT_HOSTNAME}" > /app/hostname_info.txt
RUN echo ${DEFAULT_HOSTNAME}

# Install node app NPM modules
RUN npm install

# Updating Debian repository
RUN apt-get update && apt -y upgrade

# 1. Install necessary dependencies for Puppeteer & Chrome
# RUN apt-get update && apt-get install curl gnupg -y \
#   && curl --location --silent https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
#   && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
#   && apt-get update \
#   && apt-get install google-chrome-stable -y --no-install-recommends \
#   && rm -rf /var/lib/apt/lists/*

# 2. Install necessary dependencies for Puppeteer and Chromium
RUN apt-get update && apt-get install -y --no-install-recommends \
  fonts-liberation \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libcups2 \
  libdrm2 \
  libgbm1 \
  libgtk-3-0 \
  libnspr4 \
  libnss3 \
  libx11-xcb1 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  xdg-utils \
  libu2f-udev \
  libxshmfence1 \
  libglu1-mesa \
  chromium
#   && apt-get clean \
#   && rm -rf /var/lib/apt/lists/*

# Install Tools
# To allow troubleshooting inter-containers communication
# e.g. goals-backend ping mongodb
# docker exec -it goals-backend ping -c 2 mongodb;

#RUN apt-get update && apt-cache search net-tools && \
RUN apt-get install -y inetutils-tools
RUN apt-get install -y iputils-ping
RUN apt-get install -y net-tools
RUN apt-get install -y telnet 
RUN apt-get install -y netcat-traditional
RUN apt-get install -y coreutils
# busybox cat /app/hostname.txt
RUN apt-get install -y busybox

# Clean up APT when done
# RUN apt-get clean && \
# rm -rf /var/lib/apt/lists/*
RUN apt-get clean

# Should you need to install anything via
# docker exec -it containerName apt install -y toolName;
# Uncomment line below
# RUN apt-get update && apt -y upgrade

# Copy all remaining code from HOST to CONTAINER
COPY . .

ARG BACKEND_PORT=3001

EXPOSE $BACKEND_PORT

CMD [ "npm", "start" ]