const kafka = require('kafka-node');
const client = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' });
const express = require('express');
const cors = require('cors');
var documents = []
var user = []

//creer un producer de document.
const producer = new kafka.Producer(client);
//creer un topic documents
producer.on('ready', function () {
    producer.createTopics(['documents'], true, function (err, data) {
        console.log(data);
    });
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false })); 
app.use(cors());

app.post('/document', (req, res) => {
    documents.push(req.body);
    res.json(documents);
    //emetre dans le producer
    producer.send([{ topic: 'documents', messages: JSON.stringify(req.body) }], (err, data) => {
        if (err) {
            console.error(`Erreur lors de l'envoi du message  : `, err);
        } else {
            console.log('Message envoyé avec succès :', data);
        }
    });
});
app.get('/document', (req, res) => {
    res.json(documents);
}
);

//creer un consummer pour les document
const documentConsumer = new kafka.Consumer(client, [{ topic: 'users', partition: 0 }]);
//consommer les messages
documentConsumer.on('message', function (message) {
    console.log(message);
    //metre a jou les user
    user.push(JSON.parse(message.value))
    console.log(user)
});


app.listen(3001, () => {
    console.log('Serveur à l\'écoute du port locahost:3001');
});
