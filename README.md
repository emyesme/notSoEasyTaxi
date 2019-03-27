# notSoEasyTaxi


necesario
```
sudo apt-get install nodejs
```

verifico lo basico necesario
```
node -v
npm -v
```

despues de descargado el repo
```
npm install
```

ejecutar front
```
npm start
```
ejecutar back (para hacer cambios)
```
npm run dev
```
#Cosas de DockerFile y DockerCompose todavia no implementadas (Ubuntu 16.04)

Para tener docker

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
docker-compose run
```

Estudiantes:
Jaime Cuartas
Emily Carvajal

