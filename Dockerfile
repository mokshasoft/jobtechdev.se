FROM rprakashg/hugo-docker as builder
RUN mkdir -p /var/www/hugo
COPY ./site /var/www/hugo
COPY ./thebeginning /var/www/hugo/thebeginning
WORKDIR /var/www/hugo
RUN hugo
###
FROM alpine:latest
ARG ARG_BUILD_NAME
ARG ARG_USER=default
ARG ARG_PASSWD=default

ENV buildName=$ARG_BUILD_NAME
ENV USER=$ARG_USER
ENV PASSWD=$ARG_PASSWD
RUN echo 'kolla:' ${USER} ${ARG_PASSWD} ' buildName:'${buildName}

EXPOSE 8080

RUN apk update && apk upgrade

RUN apk add --no-cache --update -v \
        supervisor \
        nginx \
        git \
        curl

RUN rm -rf /var/cache/apk/*

ENV TZ=Europe/Paris
RUN date +"%Y-%m-%dT%H:%M:%S %Z"
RUN apk add -q apache2-utils && htpasswd -dbc /etc/nginx/htpasswd $USER $PASSWD
#Move config to image
RUN mkdir /tmp/conf
COPY prod-nginx.conf /tmp/conf
COPY stage-nginx.conf /tmp/conf
#Cretae Document root
RUN mkdir /opt/nginx
RUN mkdir /opt/nginx/www
#Determinate which configuration we should use
RUN if [ "$buildName" = stage ];\
 then echo "Doing a Stage build" ;\
    rm -f /tmp/conf/prod-nginx.conf;\
    mv /tmp/conf/stage-nginx.conf /etc/nginx/nginx.conf;\
 else echo "Doing a Production build";\
     rm -f /tmp/conf/stage-nginx.conf;\
     mv /tmp/conf/prod-nginx.conf /etc/nginx/nginx.conf ;\
 fi
#Copy content do http server
COPY --from=builder /var/www/hugo/public /opt/nginx/www/doc
COPY --from=builder /var/www/hugo/thebeginning /opt/nginx/www
########
RUN rm /etc/nginx/conf.d/default.conf
COPY ./supervisord.conf /etc/supervisord.conf
########
RUN mkdir -p /var/run/nginx && \
    chmod -R 777 /var/run/nginx
RUN mkdir -p /var/run/supervisord /var/log/supervisord && \
    chmod -R 777 /var/run/supervisord
RUN apk add --no-cache bash
RUN chmod -R 775 /var/lib/nginx && \
    chmod -R 777 /var/log/* && \
    chmod -R 777 /var/tmp/nginx
#######
USER 10000
CMD ["/usr/bin/supervisord", "-n"]
