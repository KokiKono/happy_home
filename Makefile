root-sp:
	git pull
database-sp:
	git submodule update -i && cd database && git pull origin master
setup:
	$(MAKE) root-sp
	$(MAKE) database-sp
root-ins:
	cd server && npm i
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
	cd server && npm run mock-run
real-run:
	cd server && npm run real-run
production-run:
	cd server && npm run production-run
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
git-submodule-update:
	git submodule foreach git pull origin master
camera-clean:
	rm -rf server/views/public/images/*.jpg
