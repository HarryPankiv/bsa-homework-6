import React from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

import io from 'socket.io-client';
const socket = io('http://localhost:8000');

class Login extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			name: '',
			nickname: '',
			disabled: false
		}

		this.handleNameChange = this.handleNameChange.bind(this);
		this.handleNicknameChange = this.handleNicknameChange.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}

	handleNameChange(event) {
		this.setState({name: event.target.value});
	}

	handleNicknameChange(event) {
		this.setState({nickname: event.target.value});
		
	}
	
	render() {
		return (
			<div className="container">
				<form className="login-form">
					<div className="row">
						<span className="pink"></span>
						<span className="green"></span>
						<span className="purple"></span>
						<span className="orange"></span>
						<span className="blue"></span>
					</div>
					<h5>Sign into your account</h5>
					<input className="login-input" 
						   type="text" 
						   placeholder="nickname" 
						   value={this.state.nickname} 
						   onChange={this.handleNicknameChange} 
						   required />
					<input className="login-input" 
						   type="text" 
						   placeholder="name" 
						   value={this.state.name} 
						   onChange={this.handleNameChange}
						   required />
					<Link to="/chat" onClick={this.handleClick}>
						<input className="login-button" type="submit" value="submit" disabled={this.state.disabled}/>
					</Link>
				</form>
			</div>
		)
	}

	handleClick() {
		sessionStorage.setItem("name", this.state.name);
		sessionStorage.setItem("nickname", this.state.nickname);
		socket.emit('login', {name: this.state.name, nickname: this.state.nickname});

		socket.emit("nickname", this.state.nickname);
	}
}

export default Login;