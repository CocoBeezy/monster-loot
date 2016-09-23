import React from 'react';
import { Router, Route, Link, IndexRoute, browserHistory } from 'react-router';
import Main from './main';
import Home from './home';

export default (
	<Route path="/" component={Main}>
		<IndexRoute component={Home}/>
	</Route>

);
