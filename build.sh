#!/bin/sh
PRODUCT_NAME="durobot"
APP_NAME="durobot"
rm -rf output

mkdir -p output/bin
mkdir -p output/bin/$APP_NAME

cp -r sell/src/* output/bin/$APP_NAME/
cp -r sell/index.html output/bin/

#cd output/
#tar cvzf $APP_NAME.tar.gz *
#mv $APP_NAME.tar.gz ../
#rm -rf *
#mv ../$APP_NAME.tar.gz ./
#cd ..

echo "build success"
