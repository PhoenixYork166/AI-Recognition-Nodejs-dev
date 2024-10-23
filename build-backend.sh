#!/bin/bash

# $(pwd) = projectFolder/backend
docker build -t ai-nodejs:latest -f ./nodejs.Dockerfile .