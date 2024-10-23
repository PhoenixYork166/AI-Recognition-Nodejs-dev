#!/bin/bash

container_name = "ai-backend";
docker run --name $container_name -v "$(pwd)":/app -v logs:/app/logs -v /app/node_modules --rm -d -p 3001:3001 --network fullstack-network1 ai-nodejs:latest;