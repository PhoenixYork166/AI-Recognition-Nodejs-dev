#!/bin/bash

read -p "Enter Postgres username [e.g. postgres]: " userName;
psql -U $userName -c "SELECT version();";

exit 0;