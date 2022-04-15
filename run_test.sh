#!/usr/bin/env bash

echo "Building services ..."

docker-compose build

echo "Starting tests ..."

docker-compose up