setup:
	git pull
install:
	npm i && cd api/mock && npm i
swagger:
	cd api/mock && npm start
