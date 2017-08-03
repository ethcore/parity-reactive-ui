import React from 'react';
import PropTypes from 'prop-types';
import {Input} from 'semantic-ui-react';
import {Bond} from 'oo7';
import {ReactiveComponent} from 'oo7-react';

export class InputBond extends ReactiveComponent {
	constructor () {
		super(['style', 'className', 'disabled']);
		this.state = {
			display: null,
			internal: null,
			external: null,
			ok: false,
			extra: {},
			onlyDefault: true
		};
	}

	handleEdit(v, onlyDefault = false) {
		this.resetDefaultValueUpdate();

		let f = function (b) {
			if (typeof(b) === 'string') {
				b = { display: b, external: b, internal: b };
			}
			if (typeof(b) !== 'object') {
				throw { message: 'Invalid value returned from validity function. Must be object with internal and optionally external, display, blurred fields or null', b };
			}
			if (b === null) {
				this.setState({ok: false});
			} else {
				this.setState(s => {
					let i = b && b.hasOwnProperty('internal') ? b.internal : s.internal;
					return {
						ok: true,
						internal: i,
						display: typeof(b.display) === 'string' ? b.display : s.display,
						corrected: b.corrected,
						extra: b.extra || {},
						onlyDefault,
						external: b && b.hasOwnProperty('external') ? b.external : i
					};
				});
			}
			if (this.props.bond instanceof Bond) {
				if (b === null) {
					this.props.bond.reset();
				} else {
					this.props.bond.changed(b && b.hasOwnProperty('external') ? b.external : b && b.hasOwnProperty('internal') ? b.internal : this.state.internal);
				}
			}
		}.bind(this);

		this.setState({display: v, onlyDefault});

		if (typeof(this.props.validator) !== 'function') {
			f(v);
		} else {
			let a = v !== undefined && this.props.validator(v, this.state);
			if (a instanceof Promise || a instanceof Bond) {
				a.then(f);
			} else {
				f(a);
			}
		}
	}

	handleBlur () {
		this.setState(s => typeof(s.corrected) === 'string' && typeof(s.display) === 'string'
			? { display: s.corrected, corrected: undefined }
			: {}
		);
	}

	resetDefaultValueUpdate() {
		if (this.lastDefaultValueUpdate) {
			window.clearTimeout(this.lastDefaultValueUpdate);
			delete this.lastDefaultValueUpdate;
		}
	}

	render () {
		if (this.state.onlyDefault && typeof(this.props.defaultValue) === 'string' && this.state.display !== this.props.defaultValue) {
			this.resetDefaultValueUpdate();
			this.lastDefaultValueUpdate = window.setTimeout(() => { this.handleEdit(this.props.defaultValue, true); }, 0);
		}
		return (<Input
			className={this.state.className}
			style={this.state.style}
			children={this.props.children}
			disabled={this.state.disabled}
			fluid={this.props.fluid}
			placeholder={this.props.placeholder}
			inverted={this.props.inverted}
			loading={this.props.loading}
			size={this.props.size}
			transparent={this.props.transparent}
			type='text'
			value={this.state.display || this.props.defaultValue}
			error={!this.state.ok}
			onKeyDown={this.props.onKeyDown}
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

InputBond.propTypes = {
	bond: PropTypes.instanceOf(Bond),
	validator: PropTypes.func,
	className: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Bond)]),
	style: PropTypes.oneOfType([PropTypes.object, PropTypes.instanceOf(Bond)]),
	children: PropTypes.node,
	disabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.instanceOf(Bond)]),
	fluid: PropTypes.bool,
	placeholder: PropTypes.string,
	inverted: PropTypes.bool,
	loading: PropTypes.func,
	size: PropTypes.string,
	transparent: PropTypes.bool,
	defaultValue: PropTypes.string,
	action: PropTypes.any,
	label: PropTypes.node,
	labelPosition: PropTypes.string,
	icon: PropTypes.node,
	iconPosition: PropTypes.string
}
