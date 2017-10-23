setup:
	git pull
install:
	npm i && cd api/mock && npm i
run-swagger:
	cd swagger && npm start
open-swagger:
	open http://localhost:3500/docs/
lint:
	eslint *.js
