const kafka = require('kafka-node');
const client = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' });
const producer = new kafka.Producer(client);
const express = require('express');
const cors = require('cors');
var users = []
documents = []

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

//creer un topic documents
producer.on('ready', function () {
    producer.createTopics(['users'], true, function (err, data) {
        console.log(data);
    });
});


app.post('/user', (req, res) => {
    users.push(req.body);
    res.json(users);
    //envoyer le message de creation de l'utilisateur
    producer.send([{ topic: 'users', messages: JSON.stringify(req.body) }], (err, data) => {
        if (err) {
            console.error(`Erreur lors de l'envoi du message  : `, err);
        } else {
            console.log('Message envoyé avec succès :', data);
        }
    });
});

app.get('/user', (req, res) => {
    res.json(users);
}
);



//creer un consummer pour les document
const documentConsumer = new kafka.Consumer(client, [{ topic: 'documents', partition: 0 }]);

// Consommer les messages
documentConsumer.on('message', function (kafkaMessage) {

    console.log("Document reçu :");
    // console.log("Contenu du message :", JSON.parse(kafkaMessage.value)); // Accéder à la propriété "value" pour obtenir le contenu du message
    console.log("Attributs :", JSON.parse(kafkaMessage.value)); 
    documents.push(JSON.parse(kafkaMessage.value))
});


app.listen(3000, () => {
    console.log('Serveur à l\'écoute du port locahost:3000');
});
