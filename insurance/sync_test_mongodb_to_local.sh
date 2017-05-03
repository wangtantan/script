#!/bin/bash -xv

originDir="$(pwd)"
cd /data/backup

dbname=huibaoDB
suffix="$(date +'%Y%m%d%H')"
backup_path="$dbname_$suffix"

mongodump    --host=121.40.82.99 --port=27017  --db="$dbname" -u huibao -p 1qaz2wsx -o "$backup_path"
mongorestore --host=127.0.0.1 --port=27017 --db="$dbname" --drop \
             --numParallelCollections=4 --numInsertionWorkersPerCollection=4 \
             --batchSize=100 --stopOnError "$backup_path/$dbname/"

cd "$originDir"
