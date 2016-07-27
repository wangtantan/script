#!/bin/bash -xv

toRoot=/data/redis
formatDate=$(date +%F)

echo "$(date +'[ %F %H:%M:%S ]') start sync redis data"
cd $toRoot && /usr/local/bin/redis-cli -h mongo --rdb dump.rdb.$formatDate ||  exit 1
echo "dump redis dataBase success: dump.rdb.$formatDate"

systemctl stop redis && systemctl is-active redis &> /dev/null && exit 2
echo "redis is stopped with success"

[ -s "dump.rdb" ] && mv dump.rdb{,.bak}
cp dump.rdb{.$formatDate,} || exit 3
echo "copy dump.rdb with success"

systemctl start redis || exit 4
echo "sync rdb and restart with success"
exit 0
