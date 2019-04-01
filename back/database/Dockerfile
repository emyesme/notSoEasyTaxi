#imagen 
FROM postgres:9.6


ADD scriptProyecto.sql /docker-entrypoint-initdb.d/script.sql
RUN chmod -R 775 /docker-entrypoint-initdb.d


