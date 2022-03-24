install:
	cd ./builder && yarn 
	cd ./my-cra && yarn

build:
	cd ./my-cra && yarn build
	cp -a ./my-cra/build/* ./builder/app/cra-build/
	cd ./builder && yarn build

clean:
	cd  ./builder && rm -rf ./dist ./node_modules ./app/cra-build/*
	cd ./my-cra && rm -rf ./node_modules ./build
