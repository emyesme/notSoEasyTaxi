#docker react
#imagen 
FROM node
#FROM postgres

RUN mkdir /back
ADD ./ /back
#donde esta mi codigo
WORKDIR /back

#donde estaran las librerias de mi dependencia
ENV PATH ./node_modules/.bin:$PATH

#lista de mis dependencias
COPY package.json ./package.json
COPY package-lock.json ./package-lock.json

#a ejecutar
RUN npm install
RUN npm install -D


COPY . .
#al iniciar el contenedor
CMD ["npm","run","dev"]