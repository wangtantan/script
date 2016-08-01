#!/bin/sh

#lastRestart=10
lastRestart=$(pm2 show app | grep restarts | grep -v unstable | awk '{print $4}')

while true; do
  if nc -z localhost 9003; then
    echo "9003端口正常"
  else
    echo "9003端口异常"
    #云信通知
  fi

  sleep 1
#  newRestart=15
  newRestart=$(pm2 show app | grep restarts | grep -v unstable | awk '{print $4}')
  count=$[$newRestart-$lastRestart]
  if [ $count -gt 3 ]; then
    echo "重启过多"
    #云信通知
  else
    echo "重启正常"
  fi
  lastRestart=$newRestart
done
