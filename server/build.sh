#!/bin/bash
#This is needed to get the ../shared directory
#since Dockerfile can only access things in that directory
cp -r ../shared ./shared 
docker build --pull --rm -f "Dockerfile" -t meetapp:latest "."
rm -rf ./shared