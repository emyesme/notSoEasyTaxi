# notSoEasyTaxi

Si desea usar el modo con docker o modo estandar

primero debe modificar el siguiente archivo

dependiendo de su decision

En : notSoEasyTaxi/back/queries.js
Lineas 5 o 7 

Quite el comentario de la linea 5 si desea usar el modo docker

Quite el comentario de la linea 7 si desea usar el modo estandar

Y luego siga las instrucciones correspondientes

# Docker (Ubuntu 16.04)

```
sudo apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D
sudo apt-add-repository 'deb https://apt.dockerproject.org/repo ubuntu-xenial main'
sudo apt-get update
apt-cache policy docker-engine
sudo apt-get install -y docker-engine
sudo systemctl status docker //tiene que decir status:active en alguna parte del output
sudo usermod -aG docker $USER //docker sin sudo
```
s
para el docker-compose.yml
```
sudo apt install docker-compose
```
Una vez en la carpeta notSoEasyTaxi/ ejecute
```
docker-compose build
docker-compose up
```
ver el localhost:3000/

# Estandar

Descargar el repositorio 

Entra en la carpeta frontreact y ejecuta
```
npm install 
npm start
```

Entra en la carpeta back y ejecuta
```
npm install
npm run dev
```

Una vez iniciado en front y back
ver el localhost:3000/

# Al iniciar

Al utilizar el programa puede acceder a estos usuarios ya creados

Conductores:

Celular: 3103333333
Contraseña: 123

Celular: 3102222222
Contraseña: 123

Usuarios:

Celular: 310730371
Contraseña: hola

Celular: 3101111111
Contraseña: hola

#Estudiantes

Jaime Cuartas
Emily Carvajal
