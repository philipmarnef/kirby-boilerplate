FROM php:7.1-apache

COPY config/php.ini /usr/local/etc/php/

# create the same user www-data as on the host machine
RUN usermod -u 1000 www-data
RUN usermod -G staff www-data

# install imagick
RUN apt-get update -y && apt-get install -y software-properties-common
RUN apt-get update -y && apt-get install -y \
    libfreetype6-dev libpng-dev libjpeg62-turbo-dev \
    libmagickwand-dev

RUN pecl install imagick \
    && docker-php-ext-enable imagick

RUN a2enmod rewrite
RUN service apache2 restart
