#!/bin/bash

PROJECT_NAME=mateacademy-react-server
OUT_FOLDER=dist

rm -rf tmp ; mkdir tmp;
cp -r $OUT_FOLDER tmp
cd tmp
git init ; heroku git:remote -a $PROJECT_NAME
git add . ; git commit -m 'auto deploy2heroku' ; git push -f heroku master
( cd .. ; rm -rf tmp )
