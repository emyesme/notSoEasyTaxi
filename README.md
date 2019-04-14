# notSoEasyTaxi

# Docker (Ubuntu 16.04)
r

```
sudo apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D
sudo apt-add-repository 'deb https://apt.dockerproject.org/repo ubuntu-xenial main'
sudo apt-get update
apt-cache policy docker-engine
sudo apt-get install -y docker-engine
sudo systemctl status docker //tiene que decir status:active en alguna parte del output
sudo usermod -aG docker $USER //docker sin sudo
```

para el docker-compose.yml
```
sudo apt install docker-compose
```

Build de compose.yml
```
docker-compose build
docker-compose up
```
ver el localhost:3000/

Estudiantes:
Jaime Cuartas
Emily Carvajal

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
