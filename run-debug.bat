rem Compile client
cd ./client
call tsc
cd ..

rem Compile server
cd ./server
call tsc
cd ..

rem Start app
set DEBUG=mcdates:* & npm start

rem EOF