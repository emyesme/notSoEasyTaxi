#docker react
#imagen 
FROM node
#FROM postgres

#donde esta mi codigo
WORKDIR ./

#donde estaran las librerias de mi dependencia
ENV PATH ./node_modules/.bin:$PATH

#lista de mis dependencias
COPY package.json ./package.json

#a ejecutar
RUN npm install

#al iniciar el contenedor
CMD ["npm","run","dev"]