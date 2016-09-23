import React, { Component } from 'react';
import { Link } from 'react-router';
import Hammer from 'react-hammerjs';

// Styles
require('../../public/styles/index.scss');

class Main extends Component {
	constructor(props) {
		super(props);
	}



	render() {
		return (
			<div className="app-container">
				<img className="ml-logo-img" src="/public/images/Monster_Loot_Logo.png" />
				<h1 className="app-container-title">Monster Loot Comment Picker</h1>
					{this.props.children}
				<div></div>
			</div>
		);
	}

}

export default Main;
