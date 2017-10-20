setup:
	git pull
install:
	npm i && cd api/mock && npm i
swagger:
	cd api/mock && npm start
open-swagger:
	open http://localhost:3500/swagger
lint:
	eslint *.js
