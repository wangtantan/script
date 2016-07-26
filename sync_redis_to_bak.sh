#!/bin/bash

formatDate=$(date +%F)
host=mongo
toRoot=/data/redis

echo "start sync redis from $host to localhost"
systemctl is-active redis
if [ $? != 0 ]; then
  echo "redis is stopped: 1"
  exit 1
fi
echo "redis is active"
cd $toRoot && /usr/local/bin/redis-cli -h mongo --rdb dump.rdb.$(date +%F)
if [ $? != 0 ]; then
  echo "dump redis dataBase failed: 2"
  exit 2
fi
echo "dump redis dataBase success: dump.rdb.$(formatDate)"

systemctl stop redis

if systemctl is-active redis; then
  echo "redis can't be stopped fail: 3"
  exit 3
fi
echo "redis is stopped with success"

[ -s "$toRoot/dump.rdb" ] && cp $toRoot/dump.rdb $toRoot/dump.rdb.bak
cp $toRoot/dump.rdb.$(formatDate) $toRoot/dump.rdb
if [ $? != 0 ]; then
  echo "copy rdb with fail: 4"
  exit 4
fi
echo "copy dump.rdb with success"

systemctl start redis
if [ $? != 0 ]; then
  echo "restart with fail: 5"
  exit 5
fi

echo "sync rdb and restart with success"
exit 0

