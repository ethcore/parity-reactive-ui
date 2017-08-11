import React from 'react';
import PropTypes from 'prop-types';
import {ReactiveComponent} from 'oo7-react';
import {bonds} from 'oo7-parity';
import {Button} from 'semantic-ui-react';
import {SigningProgressLabel, styleStatus} from './SigningProgressLabel';

export class SigningButton extends React.Component {
	constructor () {
		super();
		this.state = { status: null };
		this.handleClick = this.handleClick.bind(this);
	}
	handleClick () {
		let s = this.state;
		if (s.status) {
			s.status = null;
		} else {
			s.status = bonds.sign(this.props.message, this.props.from);
			s.status.done(v => this.props.onSigned(v));
		}
		this.setState(s);
	}
	render () {
		return <SigningButtonAux
			icon={this.props.icon}
			primary={this.props.primary}
			secondary={this.props.secondary}
			content={this.props.content}
			color={this.props.color}
			status={this.state.status}
			onClick={this.handleClick}
			onSigned={this.props.onSigned}
			statusText={this.props.statusText}
			statusIcon={this.props.statusIcon}
			colorPolicy={this.props.colorPolicy}
			disabled={this.props.disabled}
		/>
	}//
}
SigningButton.defaultProps = {
	statusText: false,
	statusIcon: true,
	colorPolicy: 'button'
};

class SigningButtonAux extends ReactiveComponent {
	constructor() {
		super(['status']);
	}
	render() {
		let clickable = !this.state.status || this.state.status.signed || this.state.status.failed;
		let status = this.state.status && styleStatus(this.state.status);
		let statusColor = status ? status.color : null;
		let labelColor = (this.props.colorPolicy === 'button' ? this.props.color : null) || statusColor || this.props.color;
		let buttonColor = (this.props.colorPolicy === 'status' ? statusColor : this.props.color) || this.props.color || statusColor;
		return (<Button
			icon={this.props.icon}
			primary={this.props.primary}
			secondary={this.props.secondary}
			content={this.props.content}
			color={buttonColor}
			onClick={this.props.onClick}
			label={this.state.status ? (<SigningProgressLabel
				value={this.state.status}
				showContent={this.props.statusText}
				showIcon={this.props.statusIcon}
				color={labelColor}
				basic={labelColor == buttonColor ? null : false}
			/>) : null}
			disabled={this.props.disabled || !clickable}
		/>);
	}
}


SigningButton.PropTypes = {
	icon: PropTypes.node,
	primary: PropTypes.bool,
	secondary: PropTypes.bool,
	content: PropTypes.node,
	color: PropTypes.string,
	onSigned: PropTypes.func,
	statusText: PropTypes.bool,
	statusIcon: PropTypes.bool,
	colorPolicy: PropTypes.string,
	disabled: PropTypes.bool,
}
