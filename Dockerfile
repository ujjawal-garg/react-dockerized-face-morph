FROM gobletsky/bionic-opencv-3.4.1:with-dlib-19.13

MAINTAINER Ujjawal Garg <ujjawal.1224@gmail.com>

ENV DEBIAN_FRONTEND noninteractive

# Install nodejs carbon
RUN apt-get update && apt-get -y install curl \
	&& curl -sL https://deb.nodesource.com/setup_8.x | bash \
	&& apt-get install -y nodejs build-essential

RUN npm i npm@5.10.0 -g

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --no-optional

# Bundle app source
COPY . .

EXPOSE 8080

RUN npm run build

CMD [ "npm", "start" ]
