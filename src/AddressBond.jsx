const React = require('react');
const { Bond } = require('oo7');
const { bonds, isNullData, toChecksumAddress } = require('oo7-parity');
const { Label } = require('semantic-ui-react');
const { AccountIcon } = require('./AccountIcon');
const { InputBond } = require('./InputBond');

class AddressBond extends InputBond {
	constructor () {
		super();

		bonds.addressOf = n => Bond.mapAll([
			bonds.registry.lookupAddress(n, 'A'),
			bonds.me
		], (reg, me) => ({
			registry: isNullData(reg) ? null : reg,
			internal: n === 'null' ? '0x0000000000000000000000000000000000000000' : n === 'me' ? me : null
		}));
	}

	makeIcon (p) {
		return p ? 'left' : this.state.ok
			? (<i style={ { opacity: 1 } } className='icon'>
				<AccountIcon
					style={ { opacity: 1, border: '0.5em solid transparent' } }
					address={ this.state.external }
				/></i>)
			: undefined;
	}

	render () {
		const labelStyle = {
			position: 'absolute',
			zIndex: this.props.labelZIndex || 10
		};

		return (
			<div>
				{InputBond.prototype.render.call(this)}
				<div>
					{this.state.ok
						? ''
						: this.state.extra.noChecksum
							? (<Label pointing color='orange' basic content='No checksum' style={ labelStyle } />)
							: (<Label pointing basic content='Unknown/invalid address' style={ labelStyle } />)}
				</div>
			</div>
		);
	}
}
AddressBond.defaultProps = {
	placeholder: '0xAddress, name or e-mail',
	validator: a => {
		const m = a.match(/^(0x)([a-fA-F0-9]+)$/);

		if (m) {
			if (m[2].length !== 40) {
				return null;
			}
			const addr = '0x' + m[2];

			if (toChecksumAddress(addr) === addr) {
				return { external: addr, internal: a, corrected: addr };
			}
			if (addr.toLowerCase() === addr) {
				return { external: addr, internal: a, corrected: addr, extra: { noChecksum: true } };
			}
			return null;
		} else {
			return bonds.addressOf(a).map(a => {
				const n = a.registry || a.internal;

				return n ? { external: n, internal: a } : null;
			});
		}
	},
	defaultValue: ''
};

module.exports = { AddressBond };
