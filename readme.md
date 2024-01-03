# Projet de recherche et d'eregistrement de documents perdus
## Comment lancer le projet
### Prérequis
- apache kafka
- nodejs
- npm
### Lancer le projet
- Lancer le serveur zookeper(executer le script `.\bin\windows\zookeeper-server-start.bat .\config\zookeeper.properties`) sous windows
# Démarrer le service Kafka broker
- Lancer le serveur kafka(executer le script `.\bin\windows\kafka-server-start.bat .\config\server.properties`) sous windows
# Créer les topics
- Créer le topic `documents` avec la commande `.\bin\windows\kafka-topics.bat --create --topic documents --bootstrap-server localhost:9092`

# Emettre des messages sur le topic `documents`
- Lancer le producer avec la commande `.\bin\windows\kafka-console-producer.bat --broker-list localhost:9092 --topic documents`

# Ecouter les messages du topic `documents`
- Lancer le consumer avec la commande `.\bin\windows\kafka-console-consumer.bat --bootstrap-server localhost:9092 --topic documents --from-beginning`
# Consommateur de la console pour lire les événements
.\bin\windows\kafka-console-consumer.bat --topic documents --from-beginning --bootstrap-server localhost:9092


- Lancer le serveur nodejs(executer le script `node server.js`) et ceux pour chaque service
- Lancer le client angular(executer le script `ng serve`) et accéder à l'adresse `http://localhost:4200/`
## Architecture du projet
### Architecture globale

