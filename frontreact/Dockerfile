#docker react
#imagen 
FROM node

#donde esta mi codigo
WORKDIR /frontreact

#donde estaran las librerias de mi dependencia
ENV PATH ./node_modules/.bin:$PATH

#lista de mis dependencias
COPY package.json ./package.json
COPY package-lock.json ./package-lock.json
#
COPY src/ ./src

#a ejecutar
RUN npm install
RUN npm install react-scripts@2.1.8

COPY . .
#al iniciar el contenedor
CMD ["npm","start"]

