const kafka = require('kafka-node');
const client = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' });
const express = require('express');
const cors = require('cors');
var documents = []
var user = []
var retrived = []



const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());


app.get('/retrived', (req, res) => {
    res.json(retrived);
}
);

//creer un consummer pour les document
const documentConsumer = new kafka.Consumer(client, [{ topic: 'documents', partition: 0 }]);
//consommer les messages
documentConsumer.on('message', function (message) {
    var data = JSON.parse(message.value)
    ok = false
    //cas ou l'utilisateur as deja un document
    retrived.forEach(element => {
        if (element.name == data.username) {
            element.documents.push(data)
            documents.push(data)
            ok = true
        }
    })
    //cas ou l'utilisateur n'as pas de document
    if (!ok) {
        for (let index = 0; index < user.length; index++) {
            if (user[index].name == data.username) {
                retrived.push({ name: user.username, email: user.enail, phone: user.phone, documents: [data] })
                documents.push(data)
                ok = true
            }
        }
    }
    //cas ou l'utilisateur n'existe pas
    else{
        documents.push(data)
    }
    console.log(message);
});

//creer un consummer pour les document
const userConsumer = new kafka.Consumer(client, [{ topic: 'users', partition: 0 }]);
//consommer les messages
userConsumer.on('message', function (message) {
    var data = JSON.parse(message.value)
    //retrived contie les user dont les documents on ete retrouver
    ok = false
    //cas ou l'utilisateur as deja un document
    documents.forEach(element => {
        if (element.username == data.name) {
            retrived.push({ name: data.name, email: data.enail, phone: data.phone, documents: [element] })
            ok = true
        }
    })
    user.push(data) //user contien tout les user

    console.log(message);
});


app.listen(3002, () => {
    console.log('Serveur à l\'écoute du port locahost:3002');
});
