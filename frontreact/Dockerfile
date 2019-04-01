#docker react
#imagen 
FROM node

#donde esta mi codigo
WORKDIR ./

#donde estaran las librerias de mi dependencia
ENV PATH ./node_modules/.bin:$PATH

#lista de mis dependencias
COPY package*.json ./
#
COPY src/ ./src

#a ejecutar
RUN npm install
RUN npm install react-scripts@2.1.8

#al iniciar el contenedor
CMD ["npm","start"]

