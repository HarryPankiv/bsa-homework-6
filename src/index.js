import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route} from 'react-router-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import createBrowserHistory from 'history/createBrowserHistory';

import Login from './Login';
import Chat from './Chat';

const history = createBrowserHistory();

ReactDOM.render(
	<Router history={history}>
		<div>
			<Route exact path="/" component={Login} />
			<Route path="/chat" component={Chat} />
		</div>
	</Router>
	, document.getElementById('root'));
registerServiceWorker();
