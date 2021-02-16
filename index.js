const {
    response
} = require('express');
const express = require('express');
const app = express();
const redis = require('redis');
const redisClient = redis.createClient();
const bodyParser = require('body-parser');

const httpServer = app.listen(3000);
const io = require('socket.io')(httpServer);


/**
 * npm init => Projekt initialisieren
 * npm install express => Express Webserver
 * npm install -D nodemon => Nodemon
 * npm install redis => Redis Client
 * npm install body-parser => Body Parser
 */

app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send("Hallo Welt2");
});

app.get('/chats/:id', (req, res) => {
    redisClient.lrange(`chat.${req.params.id}`, 0, -1, (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error");
        } else {
            res.send(data);
        }
    });
});

app.post('/chats/:id', (req, res) => {
    console.log(req.body.message);
    redisClient.rpush(`chat.${req.params.id}`, req.body.message, err => {
        if (err) {
            console.error(err);
            res.status(500).send("Error");
        } else {
            res.send('OK');
            if (subscriptions[req.params.id] != null) {
                subscriptions[req.params.id].forEach(client => client.emit('refresh', {
                    id: req.params.id
                }))
            }
        }
    });
});

const subscriptions = {};



io.on('connection', client => {
    console.log("Verbindung aufgebaut", client);

    client.on('join', data => {
        console.log('JOIN', data);
        if (subscriptions[data.id] == null) {
            subscriptions[data.id] = [];
        }
        subscriptions[data.id].push(client);
    })
});

//httpServer.listen(3000, function () {
//    console.log('Server läuft auf :3000');
//});