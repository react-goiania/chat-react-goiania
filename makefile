build: 
	git pull
	yarn
	yarn build

start:
	pm2 start yarn --name react-goiania-chat -- run start

update:
	make build
	pm2 restart react-goiania-chat