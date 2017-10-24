setup:
	git pull
install:
	npm i && cd swagger && npm i
run:
	npm start
run-debug:
	DEBUG=express:* nodemon app.js localhost 8080 --exec babel-node
run-swagger:
	cd swagger && npm start
open-swagger:
	open http://localhost:3500/docs/
lint:
	eslint *.js
