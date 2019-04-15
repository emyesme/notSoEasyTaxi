
# Estudiantes

Jaime Cuartas Granada

Código: 1632664


Emily Esmeralda Carvajal Camelo

Código: 1630436

# notSoEasyTaxi

Para la ejecución del proyecto NotSoEasyTaxi se recomienda instalar Docker-Compose

# Docker (Ubuntu 16.04)

```
sudo apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D
sudo apt-add-repository 'deb https://apt.dockerproject.org/repo ubuntu-xenial main'
sudo apt-get update
apt-cache policy docker-engine
sudo apt-get install -y docker-engine
sudo systemctl status docker # Verificar status:active
sudo usermod -aG docker $USER
```

para el docker-compose.yml
```
sudo apt install docker-compose
```
Una vez en la carpeta notSoEasyTaxi/ ejecute
```
docker-compose build
docker-compose up
```
Para detener el contenedor y eliminarlo junto con las redes que se crearon
```
docker-compose down
```

Ingresar en localhost:3000/

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


# Sin Docker Compose (No recomendado)


Descargar el repositorio 

En : notSoEasyTaxi/back/queries.js Lineas 5 o 7

Modificar la linea 5 por la linea 7 o hacer en el mismo archivo:

```
const config = require('./configs')
```
Luego:

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
Ingresar en localhost:3000/
