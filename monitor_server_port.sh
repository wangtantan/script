#!/bin/sh

lastRestart=10
#lastRestart=$(pm2 show app | grep restarts | grep -v unstable | awk '{print $4}')

while true; do
  if nc -z localhost 9003; then
    echo "9003端口正常"
  else
    echo "9003端口异常"
  node ~/node-server/scripts/pushNetEaseMessage.js 2001
  fi
  sleepTime=$((2*2))
#sleepTime=$((60*5))#second
  sleep $sleepTime
  newRestart=15
#  newRestart=$(pm2 show app | grep restarts | grep -v unstable | awk '{print $4}')
  count=$[$newRestart-$lastRestart]
  if [ $count -gt 3 ]; then
    echo "重启次数过多"
  node ~/node-server/scripts/pushNetEaseMessage.js 2002
  else
    echo "重启次数正常"
  fi
  status=''
#  status=$(pm2 show entering | grep status | awk '{print $4}')
  if [ status=='online' ]; then
    echo "entering运行正常"
  else
    echo "entering运行异常"
    node ~/node-server/scripts/pushNetEaseMessage.js 2003
  fi
  lastRestart=$newRestart
done
