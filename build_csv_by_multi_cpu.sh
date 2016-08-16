#!/bin/bash

cd ~/node-server2
timeTable=(20160423 20160501 20160511 20160521 20160601 20160611 20160621 20160701 20160711)

for ((i=0; i<8; i++))
do
  ('scripts/buildStocksAvgEffectCVS.js'  ${timeTable[$i]} ${timeTable[$[$i+1]]})
done
