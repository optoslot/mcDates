rem Compile server
cd ./server
call tsc
cd ..

rem Start app
set DEBUG=mcdates:* & npm start

rem EOF