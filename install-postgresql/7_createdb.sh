#!/bin/bash

read -p "Enter database name [e.g. test]: " dbName;
echo "Creating a testing database $dbName on PostgreSQL...";
echo "";

createdb -U postgres "smart-brain";

if [[ $? -ne 0 ]]; then
    echo "";
    echo "Failed to create $dbName postgres database";
    echo "Displaying Error code";
    echo "Exiting...";
    exit 1;
else
    echo "";
    echo "Succeeded in creating $dbName database on Postgres";
    echo "";
    exit 0;
fi

exit 0;