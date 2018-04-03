echo Compile client
cd ./client
tsc
cd ..

echo Compile server
cd ./server
tsc
cd ..

echo Start app
DEBUG=mcdates:* npm start

# EOF