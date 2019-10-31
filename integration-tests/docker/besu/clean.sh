#!/usr/bin/env bash

docker-compose down

sudo rm -rf ./data/node{1,2,3,4,5}/database
sudo rm -rf ./data/node{1,2,3,4,5}/uploads
sudo rm -rf ./data/node{1,2,3,4,5}/private
sudo rm -f ./data/node{1,2,3,4,5}/pantheon.ports
sudo rm -rf ./data/orion{1,2,3,4,5}/routerdb
