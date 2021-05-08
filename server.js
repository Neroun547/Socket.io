const express = require('express'),
  app = express(),
  http = require('http').createServer(app),
  io = require('socket.io')(http)
  
const Message = require('./schema/message');
const mongoose = require('mongoose');
const host = '127.0.0.1';
const port = 7000;

//Connect to DB 
async function start(){
  try{
    await mongoose.connect("mongodb+srv://Gosha:lzk56gk5@cluster0.hxqey.mongodb.net/websockets_db?retryWrites=true&w=majority", {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  }
  catch(e){
    process.exit(1);
  }
} 

start();

//Socket
io.on('connection', async (socket) => {
  const result = await Message.find({});
  socket.emit('allmessage', result);

  socket.on('message', async (message) => {
    socket.emit('message', message);
    
    const messageSave = new Message({
      message:message
    })

    await messageSave.save();
  })
});

//Static 
app.use(express.static(__dirname));
//Router
app.get('/', (req, res) => res.sendFile(__dirname + '/user-1.html'));
app.get('/user-2', (req, res) => res.sendFile(__dirname + '/user-2.html'));
app.get('*', (req, res) => res.send('Page not found'));
//Listen port
http.listen(port, host, () =>
  console.log(`Server listens http://${host}:${port}`)
);