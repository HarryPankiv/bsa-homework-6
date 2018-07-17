const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const mongoClient = require("mongodb").MongoClient;
var ObjectID = require('mongodb').ObjectID;


server.listen(8000);

const url = 'mongodb://127.0.0.1:27017/chatdb';

mongoClient.connect(url, function(err, database) {
	let users = database.db().collection("users");
	io.on('connection', (socket) => {

		socket.on('login', (data) => {
			users.find({nickname: data.nickname}).toArray( (err, res) => {
				res = res[0];
				if (res == undefined) {
					socket.broadcast.emit("user connect");
					users.insert({nickname: data.nickname, name: data.name, status: "just joined", messages: []});
				} else if (res.status == "online" || res.status == "just joined") {
					socket.emit("nickname taken")
				} else if (res.status == "offline" || res.status == "just left") {
					socket.broadcast.emit("user disconnected")
				}
		})});

		socket.on('nickname', (nickname) => {
			let query = users.findOne({nickname: nickname})
			socket.emit("nickname", !!query.status)
		})

		socket.on('message', (message, nickname, time) => {
			users.update({nickname: nickname}, {$push: {messages: {text: message, id: time}}});
		});

		socket.on('load messages', () => {
			users.find({}).toArray(function(err, res) {
				res = res.map((elem) => {
					return elem.messages.map( (el) => {
						return {timestamp: el.id, text: el.text, nickname: elem.nickname}
					})
				})
				socket.emit('messages loaded', res)
			});
		});

		socket.on('load users', () => {
			users.find({}).toArray(function(err, res) {
				res = res.map(el => {
					return {id: el._id, nickname: el.nickname, name: el.name, status: el.status}
				})

				socket.emit('users loaded', res)
			});
		})

		socket.on('user disconnected', (nickname) => {
			users.update({nickname: nickname}, {$set: {status: "just left"}});

			setTimeout( () => {
				users.update({nickname: nickname}, {$set: {status: "offline"}});
			}, 10000)
		})

		socket.on('change status', nickname => {
			users.update({nickname: nickname}, {$set: {status: "just joined"}});

			setTimeout( () => {
				users.update({nickname: nickname}, {$set: {status: "online"}});
			}, 10000);
		});

		socket.on('typing', () => {
			socket.broadcast.emit("user typing")
		})
	});

    // database.close();
});
