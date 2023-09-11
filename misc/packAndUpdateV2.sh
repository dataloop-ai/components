#!/bin/bash

if [[ "$PWD" != *misc* ]]; then
  cd misc
fi

# check if vue2-playground exists
if [ ! -d "./vue2.6-vite" ]; then
   echo "vue2.6-vite does not exist."
   exit 1
fi

cd vue2.6-vite
rm -rf node_modules
cd ../

rm -rf vue2-template.tar.gz
tar -czvf vue2-template.tar.gz ./vue2.6-vite

