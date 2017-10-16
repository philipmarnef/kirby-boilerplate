FROM php:7-apache

COPY config/php.ini /usr/local/etc/php/

RUN a2enmod rewrite
RUN service apache2 restart