#!/bin/bash -xv

formatDate=$(date +%F)
host=mongo
toRoot=/data/redis

cd $toRoot && /usr/local/bin/redis-cli -h mongo --rdb dump.rdb.$(date +%F) \
  || echo "dump redis dataBase failed: 2" && exit 2
echo "dump redis dataBase success: dump.rdb.$(formatDate)"

systemctl stop redis || echo "redis can't be stopped fail: 3" && exit 3
echo "redis is stopped with success"

[ -s "dump.rdb" ] && mv dump.rdb dump.rdb.bak
cp dump.rdb.$(formatDate) dump.rdb || echo "copy rdb with fail: 4" && exit 4
echo "copy dump.rdb with success"

systemctl start redis && systemctl is-active redis || echo "restart fail: 5" && exit 5

echo "sync rdb and restart with success" && exit 0
