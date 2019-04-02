#imagen 
FROM postgres:11

RUN apt-get update \
    && apt-cache showpkg postgresql-11-postgis-2.5 \
    && apt-get install -y --no-install-recommends \
        postgresql-11-postgis-2.5 \
        postgresql-11-postgis-2.5-scripts \ 
    && rm -rf /var/lib/apt/lists/*  

ADD scriptProyecto.sql /docker-entrypoint-initdb.d/script.sql
RUN chmod -R 775 /docker-entrypoint-initdb.d


