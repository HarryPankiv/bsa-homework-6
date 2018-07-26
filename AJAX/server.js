var app = require("express")(),
    http = require("http").Server(app),
    bodyParser = require('body-parser');

var messages = [];
var users = [];

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.get("/script.js", function(req, res) {
    res.sendFile(__dirname + "/script.js");
});

app.get("/style.css", function(req, res) {
    res.sendFile(__dirname + "/style.css");
});

app.get("/messages", function(req, res) {
    res.json(messages);
})

app.get("/users", function(req, res) {
    res.json(users);
})

app.post("/messages", function(req, res) {
    chackValidMessage(req.body);
    res.end();
})

app.post("/users", function(req, res) {

    var concidence = false;
    for(let i = 0; i < users.length; i++) {
        if(users[i].nickname == req.body.nickname) {
            if(users[i].name == req.body.name) {
                concidence = true;
                res.status(200);
                res.end();
            }
        }
    }
    if(!concidence) {
        users.push(req.body);
        res.status(200);
        res.end();
    }

    res.end();
})

function chackValidMessage(msg) {
    if (msg.text !== '') {
      messages.push(msg);
    }
    if (messages.length > 100) {
      messages.length = 0;
    }
  }

http.listen(1428, function() {
    console.log("litening on *:1428");
});