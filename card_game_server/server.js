// server.js

const express = require('express');
const SocketServer = require('ws').Server;
const uuidv4 = require('uuid/v4');

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create a queue
var queue = []; 

// Create the WebSockets server
const wss = new SocketServer({ server });

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.

wss.on('connection', (ws) => {
  console.log('Client connected');

  // assign unique ID for each client on connection
  let clientID = uuidv4();

  const fullDeck = [
    {cardId: 1, number: 1, suit: "diamond"},
    {cardId: 2, number: 1, suit: "spade"},
    {cardId: 3, number: 1, suit: "club"},
    {cardId: 4, number: 1, suit: "heart"},
    {cardId: 5, number: 2, suit: "diamond"},
    {cardId: 6, number: 2, suit: "spade"},
    {cardId: 7, number: 2, suit: "club"},
    {cardId: 8, number: 2, suit: "heart"},
    {cardId: 9, number: 3, suit: "diamond"},
    {cardId: 10, number: 3, suit: "spade"},
    {cardId: 11, number: 3, suit: "club"},
    {cardId: 12, number: 3, suit: "heart"},
    {cardId: 13, number: 4, suit: "diamond"},
    {cardId: 14, number: 4, suit: "spade"},
    {cardId: 15, number: 4, suit: "club"},
    {cardId: 16, number: 4, suit: "heart"},
    {cardId: 17, number: 5, suit: "diamond"},
    {cardId: 18, number: 5, suit: "spade"},
    {cardId: 19, number: 5, suit: "club"},
    {cardId: 20, number: 5, suit: "heart"},
    {cardId: 21, number: 6, suit: "diamond"},
    {cardId: 22, number: 6, suit: "spade"},
    {cardId: 23, number: 6, suit: "club"},
    {cardId: 24, number: 6, suit: "heart"},
    {cardId: 25, number: 7, suit: "diamond"},
    {cardId: 26, number: 7, suit: "spade"},
    {cardId: 27, number: 7, suit: "club"},
    {cardId: 28, number: 7, suit: "heart"},
    {cardId: 29, number: 8, suit: "diamond"},
    {cardId: 30, number: 8, suit: "spade"},
    {cardId: 31, number: 8, suit: "club"},
    {cardId: 32, number: 8, suit: "heart"},
    {cardId: 33, number: 9, suit: "diamond"},
    {cardId: 34, number: 9, suit: "spade"},
    {cardId: 35, number: 9, suit: "club"},
    {cardId: 36, number: 9, suit: "heart"},
    {cardId: 37, number: 10, suit: "diamond"},
    {cardId: 38, number: 10, suit: "spade"},
    {cardId: 39, number: 10, suit: "club"},
    {cardId: 40, number: 10, suit: "heart"},
    {cardId: 41, number: 11, suit: "diamond"},
    {cardId: 42, number: 11, suit: "spade"},
    {cardId: 43, number: 11, suit: "club"},
    {cardId: 44, number: 11, suit: "heart"},
    {cardId: 45, number: 12, suit: "diamond"},
    {cardId: 46, number: 12, suit: "spade"},
    {cardId: 47, number: 12, suit: "club"},
    {cardId: 48, number: 12, suit: "heart"},
    {cardId: 49, number: 13, suit: "diamond"},
    {cardId: 50, number: 13, suit: "spade"},
    {cardId: 51, number: 13, suit: "club"},
    {cardId: 52, number: 13, suit: "heart"}];

  var currentDeck = {type: "currentDeck", data: fullDeck};

  ws.on('message', function incoming(data) {
    const clientData = JSON.parse(data);

    switch (clientData.type) {

      case 'gameType':
      if (clientData.data === 'blackjack' && queue.includes(clientID) === false) {
        queue.push(clientID);
        console.log("In queue: ", queue);
      }

      // BUG: adding duplicate IDs when `queue.length >= 2 || queue.length === 2`
      wss.clients.forEach(client => {
        if (queue.length > 2) {
          let players = queue.splice(0, 2);
          
          let gameSession = {
            type: 'session',
            gameID: uuidv4(),
            playerOne: players[0],
            playerTwo: players[1]
          }
          client.send(JSON.stringify(gameSession));
        }
      });
      break;

      case 'blackjackHand':
      wss.clients.forEach(client => {
        client.send(JSON.stringify(clientData));
      });
      break;
    }

      wss.clients.forEach(client => {
        client.send(JSON.stringify(currentDeck));
      });
    });


  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => {
  console.log('Client disconnected')
  let disconnect = queue.indexOf(clientID);
    if (disconnect > -1) {
      queue.splice(disconnect, 1);
      console.log("After disconnect", queue)
    }
  });
});