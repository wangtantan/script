mongod --configsvr --dbpath /data/configdb --port 27019
mongod --configsvr --dbpath /data/configdb1 --port 27018
mongod --configsvr --dbpath /data/configdb2 --port 27017

mongos --configdb localhost:27017,localhost:27018,localhost:27019 --port 27000

mongod --shardsvr --dbpath /data/db --port 27020
mongod --shardsvr --dbpath /data/db2 --port 27021
mongod --shardsvr --dbpath /data/db1 --port 27022


mongo localhost:27000
