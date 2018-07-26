const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(8000);


const staticPath = path.normalize(__dirname + '/public'); // static - /public folder
app.use(express.static(staticPath));

// avaliable in req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});
//const routes = require('./routes/api/routes')(app); //start func which called user router obj


const userService = require('./services/users');
const messageService = require('./services/messages');

io.on('connection', function (socket) {

  

  socket.on('init', (data) => {
    console.log("User added");
    userService.addUser(data);
    socket.broadcast.emit('info', [data.name, true]);  
    
    io.emit('messages', [messageService.messages, userService.users]);
    io.emit('users', userService.users);
  });


  socket.on('delete user', (id) => {
       console.log("User removed");
    user = userService.deleteUser(id);
    if(user){
    socket.broadcast.emit('info', [user.name, false]);  
    }
    io.emit('users', userService.users);
  });


  socket.on('client typing', (user) => {
       console.log("Typing ", user.typing);
      userService.typingChange(user.id, user.typing);
    socket.broadcast.emit('messages', [messageService.messages, userService.users]);
  });




  socket.on('update status', (id) => {
       console.log("Status updated");
    userService.updateStatus(id);
    io.emit('users', userService.users);
  });


  socket.on("send message", (msg)=> {
    messageService.addMessage(msg);
    console.log("Added message");
    io.emit('messages', [messageService.messages, userService.users]);
  })
});