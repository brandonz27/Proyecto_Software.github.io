FROM php:8.2-apache

# Copiar todos los archivos al contenedor
COPY . /var/www/html/

# Dar permisos (opcional)
RUN chown -R www-data:www-data /var/www/html
