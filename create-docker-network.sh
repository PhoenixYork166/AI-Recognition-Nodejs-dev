#!/bin/bash

read -p "Enter Docker Network name to create [e.g. test] " $network_name;

docker network create $network_name;