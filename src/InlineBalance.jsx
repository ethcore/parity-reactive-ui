import React from 'react';
import PropTypes from 'prop-types';
import {Bond} from 'oo7';
import {BigNumber} from 'bignumber.js';
import {ReactiveComponent} from 'oo7-react';
import {splitValue, denominations} from 'oo7-parity';

let usableDenoms = denominations.filter(x => x[0] === x[0].toLowerCase());
export class InlineBalance extends ReactiveComponent {
	constructor () {
		super(['value']);
		this.state = {
			precise: false,
			denom: -1
		};
	}

	toggleViewAll () {
		let s = this.state;
		s.precise = !s.precise;
		this.setState(s);
	}

	cycleDenom () {
		let s = this.state;
		s.denom = (s.denom + 2) % (usableDenoms.length + 1) - 1;
		this.setState(s);
	}

	readyRender () {
		let v = new BigNumber(this.state.value || 0);
		let isNeg = v.lt(0);
		let s;
		if (this.state.denom === -1) {
			s = splitValue(v.mul(isNeg ? -1 : 1));
		} else {
			let dd = denominations.indexOf(usableDenoms[this.state.denom]);
			s = {
				base: v.div(new BigNumber(1000).pow(dd)),
				denom: dd
			}
		}
		let same = true;
		let units = s.base;
		if (!this.state.precise) {
			units = units.mul(1000).round().div(1000);
			same = units.eq(s.base);
		}
		units = units.toString();
		let m = units.match(/(.*)(\.[0-9]+)$/);
		let decimals = '';
		if (m) {
			units = m[1];
			decimals = m[2];
		}
		units = units.replace(/(\d)(?=(\d{3})+$)/g, "$1,");

		let d = denominations[s.denom];
		let c = '32, 32, 32';
		let fore = `rgb(${c})`;
		let back = `rgba(${c}, 0.15)`;
		return (
			<span style={{
				borderRadius: '0.2em',
				border: `0.05em solid ${back}`,
				whiteSpace: 'nowrap'
			}}>
				<span style={{
					paddingLeft: '0.3em',
					paddingRight: '0.3em',
					borderRadius: '0.2em',
					borderTopRightRadius: 0,
					borderBottomRightRadius: 0,
					fontWeight: 'bold',
					cursor: 'pointer'
				}}
					onClick={() => this.toggleViewAll()}
				>
					{isNeg ? '-' : this.props.forceSign ? '+' : ''}
					{units}
					{
						<span style={{fontSize: '85%', opacity: 0.66}}>
							{decimals}
						</span>
					}
					{same ? '' : '…'}
				</span>
				<span style={{
					paddingLeft: '0.3em',
					paddingRight: '0.4em',
					backgroundColor: back,
					cursor: 'pointer'
				}}
					onClick={() => this.cycleDenom()}
				>
					<span style={{
						borderRadius: '0.2em',
						borderTopLeftRadius: 0,
						borderBottomLeftRadius: 0,
						borderLeft: 0,
						color: 'fore',
						fontSize: '85%',
						verticalAlign: 'baseline',
						fontWeight: this.state.denom === -1 ? 'normal' : 'bold'
					}}>
						{d}
					</span>
				</span>
		    </span>
		);
	}
}

InlineBalance.propTypes = {
	value: PropTypes.oneOfType([PropTypes.instanceOf(Bond), PropTypes.number, PropTypes.string, PropTypes.object]),
	forceSign: PropTypes.bool
}
