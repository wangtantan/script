#!/bin/bash

cd ~/node-server2
timeTable=(20160423 20160501 20160511 20160521 20160601 20160611 20160621 \
           20160701 20160711 20160721 20160801 20160811 20160821)

for ((i=0; i<12; i++))
do
#echo ${timeTable[$i]} ${timeTable[$[$i+1]]}
  echo "start ${timeTable[$i]}"
  node scripts/buildStocksAvgEffectCVS.js  \
    ${timeTable[$i]} ${timeTable[$[$i+1]]} \
    >>/dev/null 2>&1
  echo "finash ${timeTable[$i]}"
done
