setup:
	git pull
install:
	npm i && cd swagger && npm i
run:
	npm start
run-debug:
	DEBUG=express:* nodemon app.js localhost 8080 --exec babel-node
mock-swagger:
	cd swagger && npm start
real-swagger:
	cd swagger && NODE_ENV=production nodemon -e yaml,js --watch app.js --watch ./*/*/*.yaml
open-swagger:
	open http://localhost:3500/docs/
edit-swagger:
	swagger project edit swagger
lint:
	eslint *.js
