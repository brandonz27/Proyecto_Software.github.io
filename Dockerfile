# Usa la imagen oficial de PHP con Apache
FROM php:8.2-apache

# Habilita mod_rewrite (opcional, si usas rutas limpias)
RUN a2enmod rewrite

# Copia TODO el contenido del proyecto al servidor web
COPY . /var/www/html/

# Asigna los permisos correctos (opcional pero recomendado)
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# Expone el puerto 80 (ya lo hace Render, pero por claridad)
EXPOSE 80
