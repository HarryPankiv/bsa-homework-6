import React from 'react';
import './Chat.css';

import io from 'socket.io-client';
const socket = io('http://localhost:8000');


class Chat extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			typing: '',
			value: '',
			messages: [],
			users: [],
			name: sessionStorage.getItem("name"),
			nickname: sessionStorage.getItem("nickname")
		}

		this.handleChange = this.handleChange.bind(this);
    	this.sendMessage = this.sendMessage.bind(this);
	}

	componentDidMount() {
		socket.emit('load messages');
		socket.on('messages loaded', messages => {
			messages = [].concat(...messages).sort( (a, b) =>{
				return a.timestamp - b.timestamp;
			});
			if (messages.length > 100) {
				let arr = messages.reverse().splice(0, 100);
				this.setState({messages: arr})
				document.getElementById('list').scrollTop = document.getElementById('list').scrollHeight;
			} else {
				this.setState({messages: messages})
				document.getElementById('list').scrollTop = document.getElementById('list').scrollHeight;
			}
		}) 

		socket.emit('load users');
		socket.on('users loaded', users => {
			this.setState({users: users})
		})

		socket.emit("change status", this.state.nickname);
		socket.on("status", state => {
			socket.emit('load users');
			socket.on('users loaded', users => {
				this.setState({users: users})
			})
		})

		socket.on('disconnect', () => {
			console.log('disconnect')
		})
		
		this.forceUpdate();
	}

	componentWillUnmount() {
		socket.emit("user disconnected", this.state.nickname)
	}

	handleChange(event) {
		this.setState({value: event.target.value});
		socket.on("user typing", () => {
			this.setState({typing: 'lol memes'})
		})
	}

	handleSubmit(event) {
	}

	render() {
		return (
			<div className="wrapper">
				<div className="friends-list">
					<ul>
						{this.state.users.map( el => {
							return <li key={el.id}>
									<h4>{el.name}</h4>
									<label>{el.status}</label>
								</li>
						})}
					</ul>
				</div>
				<div className="messages">
					<ul id="list">
						{this.state.messages.map( el => {
							return <li key={el.timestamp} className="message">{el.nickname}: {el.text}</li>})
						}
					</ul>
					<span>{this.state.typing}</span>
					<div>
						<input className="message-input" type="text" value={this.state.value} onChange={this.handleChange} placeholder="enter message"/>
						<input className="message-button" type="submit" onClick={this.sendMessage} value="send"/>
					</div>
				</div>
			</div>
		)
	}

	sendMessage(event) {
		if (this.state.value !== "") {
			let message = this.state.value;
			socket.emit('message', message, sessionStorage.nickname, Date.now());
			this.setState({value: ''});
			socket.emit('load messages');
			socket.on('messages loaded', (messages) => {
				messages = [].concat(...messages).sort( (a, b) =>{
					return a.timestamp - b.timestamp;
				});
				if (messages[0].length > 100) {
					this.setState({messages: messages.slice(0, 100)})
					document.getElementById('list').scrollTop = document.getElementById('list').scrollHeight;
				} else {
					this.setState({messages: messages})
					document.getElementById('list').scrollTop = document.getElementById('list').scrollHeight;
				}
			})
			event.preventDefault();
		} else {
			console.log('enter message')
		}
	}
}

export default Chat;