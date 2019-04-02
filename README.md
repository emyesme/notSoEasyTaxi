# notSoEasyTaxi

# Cosas de DockerFile y DockerCompose (Ubuntu 16.04)

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
docker-compose up
```
ver el localhost:8080/

Estudiantes:
Jaime Cuartas
Emily Carvajal

# Nota: 
Falta la extension de postgis
