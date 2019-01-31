// server.js

require('dotenv').config();
const env = process.env.ENV || 'development';

const express = require('express');
const SocketServer = require('ws').Server;
const uuidv4 = require('uuidv4');
const bodyParser = require('body-parser');
const knexConfig = require('./knexfile');
const knex = require('knex')(knexConfig[env]);
const path = require('path');

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname, 'client/build')));

// Set the port to 3001
const PORT = process.env.PORT || 3001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create a queue
var blackjackQueue = [];
var warQueue = [];
var currentBlackjackGame = null;
var currentWarGame = null;
// var users = [];

// Create the WebSockets server
const wss = new SocketServer({ server });

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.

wss.on('connection', (ws) => {
  console.log('Client connected');

  // assign unique ID for each client on connection
  // var clientID = uuidv4();

  const fullDeck = [
    {cardId: 1, number: 1, suit: 1},
    {cardId: 2, number: 1, suit: 3},
    {cardId: 3, number: 1, suit: 0},
    {cardId: 4, number: 1, suit: 2},
    {cardId: 5, number: 2, suit: 1},
    {cardId: 6, number: 2, suit: 3},
    {cardId: 7, number: 2, suit: 0},
    {cardId: 8, number: 2, suit: 2},
    {cardId: 9, number: 3, suit: 1},
    {cardId: 10, number: 3, suit: 3},
    {cardId: 11, number: 3, suit: 0},
    {cardId: 12, number: 3, suit: 2},
    {cardId: 13, number: 4, suit: 1},
    {cardId: 14, number: 4, suit: 3},
    {cardId: 15, number: 4, suit: 0},
    {cardId: 16, number: 4, suit: 2},
    {cardId: 17, number: 5, suit: 1},
    {cardId: 18, number: 5, suit: 3},
    {cardId: 19, number: 5, suit: 0},
    {cardId: 20, number: 5, suit: 2},
    {cardId: 21, number: 6, suit: 1},
    {cardId: 22, number: 6, suit: 3},
    {cardId: 23, number: 6, suit: 0},
    {cardId: 24, number: 6, suit: 2},
    {cardId: 25, number: 7, suit: 1},
    {cardId: 26, number: 7, suit: 3},
    {cardId: 27, number: 7, suit: 0},
    {cardId: 28, number: 7, suit: 2},
    {cardId: 29, number: 8, suit: 1},
    {cardId: 30, number: 8, suit: 3},
    {cardId: 31, number: 8, suit: 0},
    {cardId: 32, number: 8, suit: 2},
    {cardId: 33, number: 9, suit: 1},
    {cardId: 34, number: 9, suit: 3},
    {cardId: 35, number: 9, suit: 0},
    {cardId: 36, number: 9, suit: 2},
    {cardId: 37, number: 10, suit: 1},
    {cardId: 38, number: 10, suit: 3},
    {cardId: 39, number: 10, suit: 0},
    {cardId: 40, number: 10, suit: 2},
    {cardId: 41, number: 11, suit: 1},
    {cardId: 42, number: 11, suit: 3},
    {cardId: 43, number: 11, suit: 0},
    {cardId: 44, number: 11, suit: 2},
    {cardId: 45, number: 12, suit: 1},
    {cardId: 46, number: 12, suit: 3},
    {cardId: 47, number: 12, suit: 0},
    {cardId: 48, number: 12, suit: 2},
    {cardId: 49, number: 13, suit: 1},
    {cardId: 50, number: 13, suit: 3},
    {cardId: 51, number: 13, suit: 0},
    {cardId: 52, number: 13, suit: 2}];

  var currentDeck = {type: "currentDeck", data: fullDeck};

  ws.on('message', function incoming(data) {
    const clientData = JSON.parse(data);

    switch (clientData.type) {

      case 'login':
      // let currentUser = uuidv4();
      let gameType = clientData.gameType;
      knex('users')
        .select('id', 'username')
        .where({
          email: clientData.email,
          password: clientData.password
          })
        .then((userData) => {
          ws.id = uuidv4();
          let user = { websocketId: ws.id, userId: userData[0].id, username: userData[0].username};
          // users.push(user);
          if (gameType === "blackjack") {
            blackjackQueue.push(user);
            if (blackjackQueue.length === 1) {
              knex('games')
                .insert({
                  type: gameType,
                  date: new Date()
                })
                .returning('id')
                .then((gameData) => {
                  currentBlackjackGame = gameData[0];
                  wss.clients.forEach(client => {
                    client.send(JSON.stringify({type: "login", msg: "ur in q for blackjack"}));
                  });
                });
            } else if (blackjackQueue.length === 2) {
              let formattedData = {users: blackjackQueue, type: "login", game_id: currentBlackjackGame, currentDeck: fullDeck};
              wss.clients.forEach(client => {
                client.send(JSON.stringify(formattedData));
              });
              blackjackQueue.pop();
              blackjackQueue.pop();
            }
          } else if (gameType === "war") {
            warQueue.push(userData[0]);
            if (warQueue.length === 1) {
              knex('games')
                .insert({
                  type: gameType,
                  date: new Date()
                })
                .returning('id')
                .then((gameData) => {
                  currentWarGame = gameData[0];
                  wss.clients.forEach(client => {
                    client.send(JSON.stringify({type: "login", msg: "ur in q for war"}));
                  });
                });
            } else if (warQueue.length === 2) {
              let formattedData = {users: warQueue, type: "login", game_id: currentWarGame, currentDeck: fullDeck};
              wss.clients.forEach(client => {
                client.send(JSON.stringify(formattedData));
              });
              warQueue.pop();
              warQueue.pop();
            }
          }
        });
        break;

      case 'blackjackHand':
      let player1Connection = clientData.players[0].websocketId;
      let player2Connection = clientData.players[1].websocketId;
      wss.clients.forEach(client => {
        if (client.id === player1Connection || client.id === player2Connection) {
          client.send(JSON.stringify(clientData));
        }
      });
      break;
    }

      wss.clients.forEach(client => {
        client.send(JSON.stringify(currentDeck));
      });
    });


  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => {
  console.log('Client disconnected');
  // let disconnect = blackjackQueue.indexOf(currentUser);
  //   if (disconnect > -1) {
  //     blackjackQueue.splice(disconnect, 1);
  //   }
  });
});