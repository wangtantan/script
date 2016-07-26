#!/bin/bash -xv

host=mongo
toRoot=/data/redis

cd $toRoot && /usr/local/bin/redis-cli -h mongo --rdb dump.rdb.$(date +%F) ||  exit 1
echo "dump redis dataBase success: dump.rdb.$(date +%F)"

systemctl stop redis && systemctl is-active redis && exit 2
echo "redis is stopped with success"

[ -s "dump.rdb" ] && cp dump.rdb dump.rdb.bak
cp dump.rdb.$(date +%F) dump.rdb || exit 3
echo "copy dump.rdb with success"

systemctl start redis || exit 4
echo "sync rdb and restart with success"
exit 0

