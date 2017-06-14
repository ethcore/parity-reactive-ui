import React from 'react';
import {Input} from 'semantic-ui-react';
import {Bond} from 'oo7';

export class InputBond extends React.Component {
	constructor () {
		super();
		this.state = {
			display: undefined,
			internal: undefined,
			external: undefined,
			ok: false,
			extra: {}
		};
	}

	dispatcher = (b) => {
		if (typeof(b) === 'string') {
			b = { display: b, external: b, internal: b };
		}
		if (typeof(b) !== 'object') {
			throw { message: 'Invalid value returned from validity function. Must be object with internal and optionally external, display, blurred fields or null', b };
		}
		if (b === null) {
			this.setState({ok: false});
		} else {
			const i = b && b.hasOwnProperty('internal') ? b.internal : this.state.internal;
			this.setState({
				ok: true,
				internal: i,
				display: typeof(b.display) === 'string' ? b.display : this.state.display,
				corrected: b.corrected,
				extra: b.extra || {},
				external: b && b.hasOwnProperty('external') ? b.external : i
			});
		}
		if (this.props.bond instanceof Bond) {
			if (b === null) {
				this.props.bond.reset();
			} else {
				this.props.bond.changed(b && b.hasOwnProperty('external') ? b.external : b && b.hasOwnProperty('internal') ? b.internal : this.state.internal);
			}
		}
	}

	handleEdit(display) {
		this.setState({display});

		if (typeof(this.props.validator) !== 'function') {
			this.dispatcher(display);
		} else {
			const a = display !== undefined &&
				this.props.validator(display, this.state);
			if (a instanceof Promise || a instanceof Bond) {
				a.then(this.dispatcher);
			} else {
				this.dispatcher(a);
			}
		}
	}

	componentWillMount() {
		const {display} = this.state;
		const {defaultValue} = this.props;
		this.handleEdit(
			typeof(display) === 'string'
				? display
			: typeof(defaultValue) === 'string'
				? defaultValue
			: ''
		);
	}

	handleBlur () {
		let s = this.state;
		if (typeof(s.corrected) === 'string') {
			s.display = s.corrected;
			delete s.corrected;
			this.setState(s);
		}
	}

	render () {
		return (<Input
			className={this.props.className}
			style={this.props.style}
			name={this.props.name}
			children={this.props.children}
			disabled={this.props.disabled}
			fluid={this.props.fluid}
			placeholder={this.props.placeholder}
			inverted={this.props.inverted}
			loading={this.props.loading}
			size={this.props.size}
			transparent={this.props.transparent}
			type='text'
			value={this.state.display}
			error={!this.state.ok}
			onChange={(e, v) => this.handleEdit(v.value)}
			onBlur={() => this.handleBlur()}
			action={this.makeAction ? this.makeAction() : this.props.action}
			label={this.makeLabel ? this.makeLabel() : this.props.label}
			labelPosition={this.makeLabel ? this.makeLabel(true) : this.props.labelPosition}
			icon={this.makeIcon ? this.makeIcon() : this.props.icon}
			iconPosition={this.makeIcon ? this.makeIcon(true) : this.props.iconPosition}
		/>);
	}
}
InputBond.defaultProps = {
	placeholder: '',
	defaultValue: ''
};
