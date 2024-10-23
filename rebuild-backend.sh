#!/bin/bash

docker rmi ai-nodejs:latest;
docker build -t ai-nodejs:latest -f ./nodejs.Dockerfile .