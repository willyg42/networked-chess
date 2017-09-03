//initializing the app
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

const port = process.env.PORT || 3000;
const chessobjects = require('./chess-objects')

server.listen(port,function() {
  console.log('Server listening at port ' + port)
})

app.use(express.static(__dirname + '/public'))

//server side game logic
let numUsers = 0
let whiteLoggedIn = false
let blackLoggedIn = false
io.on('connection', function(client) {

  client.on('add user', function(username) {
    numUsers++
    client.username = username
    console.log(client.username + " has logged in.")
    console.log(numUsers + " users are connected.")
    if(!whiteLoggedIn && !blackLoggedIn) {
      const rand = Math.floor(Math.random() * (2));
      if(rand === 0){
        client.color = "white"
        whiteLoggedIn = true
      } else {
        client.color = "black"
        blackLoggedIn = true
      }
      console.log(client.username + " has been randomly selected to play as " + client.color + ".")
    }
    else if(whiteLoggedIn && blackLoggedIn) {
      client.color = "spectator"
      console.log("This game already has two players, so " + client.username + " will be a " + client.color + " for this match.")
    }
    else {
      if(blackLoggedIn){
        client.color = "white"
        whiteLoggedIn = true
      } else {
        client.color = "black"
        blackLoggedIn = true
      }
      console.log(client.username + " has joined the game second and will play as " + client.color + ".")
    }
    //client.emit('newGame', game, client.color)
  })

})