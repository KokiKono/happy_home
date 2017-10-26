setup:
	git pull
install:
	npm i && cd swagger && npm i
update:
	git pull && npm i && cd swagger && npm i
mock-run:
	npm run mock-run
real-run:
	npm run real-run
run-debug:
	DEBUG=express:* nodemon app.js localhost 8080 --exec babel-node
open-swagger:
	open http://localhost:3500/docs/
edit-swagger:
	cd swagger && $(npm bin)/swagger project edit swagger
lint:
	npm run lint
