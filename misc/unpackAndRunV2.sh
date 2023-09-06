#!/bin/bash

if [[ "$PWD" != *misc* ]]; then
  cd misc
fi

# check if vue2-playground exists
if [ ! -d "vue2.6-vite" ]; then
   tar -zxvf vue2-template.tar.gz -c ./vue2.6-vite

   sleep 0.5s
fi

cd ../
rm -rf *.tgz
npm pack

sleep 0.5s

yourfilenames=`ls ./*.tgz`

cd misc
cd vue2.6-vite
npm i

for eachfile in $yourfilenames
do
   npm i ../../$eachfile
done

exec npm run dev