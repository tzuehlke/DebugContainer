FROM node:11.15.0-stretch-slim

# ssh
ENV SSH_PASSWD "root:Docker!"
RUN apt-get update \
        && apt-get install -y --no-install-recommends dialog \
        && apt-get update \
    && apt-get install -y --no-install-recommends openssh-server \
    && echo "$SSH_PASSWD" | chpasswd 
COPY sshd_config /etc/ssh/
COPY init.sh /usr/local/bin/  
RUN chmod u+x /usr/local/bin/init.sh
EXPOSE 2222

# webapp
RUN mkdir -p /usr/src/app
COPY ./app/package.json /usr/src/app/
WORKDIR /usr/src/app
RUN npm install 

COPY ./app/*.* /usr/src/app/
RUN mkdir -p /usr/src/app/public
COPY ./app/public/* /usr/src/app/public/
COPY ./app/* /usr/src/app/

EXPOSE 80
#CMD [ "npm", "start" ]
ENTRYPOINT ["/usr/local/bin/init.sh"]