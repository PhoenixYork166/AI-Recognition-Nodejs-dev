#!/bin/bash

read -p "Enter host [e.g. 127.0.0.1]: " host;
read -p "Enter tcp port for Postgres [e.g. 5432]: " port;
read -p "Enter username [e.g. postgres]: " userName;
read -p "Enter database name [e.g. test]: " dbName;
read -p "Enter backup name [e.g. test_backup] " backupName;
echo "Performing backup on database '$dbName'...";
echo "";

# pg_dump -U $userName -h 127.0.0.1 -p 5432 -d $dbName -f $backupName;
pg_dump -U $userName -h $host -p $port -d $dbName -F c -f "$backupName.dump";

if [[ $? -ne 0 ]]; then
    echo "";
    echo "Failed to backup database: $dbName...";
    echo "Displaying Error code";
    echo "Exiting...";
    exit 1;
else
    echo "";
    echo "Succeeded in backup for database: $dbName";
    echo "";
    exit 0;
fi

exit 0;