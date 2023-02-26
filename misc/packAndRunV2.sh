#!/bin/bash

cd misc

# check if vue2-playground exists
if [ ! -d "vue2-playground" ]; then
   tar -xf vue2-playground.zip
   sleep 0.5s
fi

cd ../
rm -rf *.tgz
npm pack

sleep 0.5s

yourfilenames=`ls ./*.tgz`

cd misc
cd vue2-playground
npm i

for eachfile in $yourfilenames
do
   npm i ../../$eachfile
done

exec npm run dev