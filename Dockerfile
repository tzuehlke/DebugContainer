FROM node:8.2.0-alpine
RUN mkdir -p /usr/src/app
COPY ./app/package.json /usr/src/app/
WORKDIR /usr/src/app
RUN npm install 

COPY ./app/*.* /usr/src/app/
RUN mkdir -p /usr/src/app/public
COPY ./app/public/* /usr/src/app/public/
COPY ./app/* /usr/src/app/

EXPOSE 80
CMD [ "npm", "start" ]
