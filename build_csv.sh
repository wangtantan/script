#!/bin/bash

cd ~/node-server
timeTable=(20130101 20140101)

for ((i=0; i<1; i++))
do
#echo ${timeTable[$i]} ${timeTable[$[$i+1]]}
  echo "start $[$i+1]"
  node scripts/buildStocksChengjiaoeRate.js  \
    ${timeTable[$i]} ${timeTable[$[$i+1]]} \
#    >>/dev/null 2>&1
  echo "finash ${timeTable[$i]} to ${timeTable[$[$i+1]]} "
done
