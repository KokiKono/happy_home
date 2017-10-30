root-sp:
	git pull
database-sp:
	git submodule update -i && cd database && git pull
setup:
	$(MAKE) root-sp
	$(MAKE) database-sp
root-ins:
	npm i
swagger-ins:
	cd swagger && npm i
database-ins:
	cd database && npm i
install:
	$(MAKE) root-ins
	$(MAKE) swagger-ins
	$(MAKE) database-ins
db-migrate-up:
	cd database && npm run up
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
update:
	git pull
	$(MAKE) database-sp
	$(MAKE) install
	$(MAKE) db-migrate-up
