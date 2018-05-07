#!/bin/sh
PRODUCT_NAME="durobot"
APP_NAME="durobot"
rm -rf output

mkdir -p output/function_page

cp -r sell/dist/* output/function_page/

#cd output/
#tar cvzf $APP_NAME.tar.gz *
#mv $APP_NAME.tar.gz ../
#rm -rf *
#mv ../$APP_NAME.tar.gz ./
#cd ..

echo "build success"
