const React = require('react');
const { BigNumber } = require('bignumber.js');
const { ReactiveComponent } = require('oo7-react');

// keeps balance of ether up to date
class EtherBalance extends ReactiveComponent {
	constructor () { super(['balance']); }

	render () {
		if (typeof this.state.balance === 'undefined') {
			return (<span>Loading...</span>);
		}
		
		const ethVal = (new BigNumber(this.state.balance)).div(new BigNumber('1e+18')).toFormat(5);
		return (<span>&Xi; {ethVal}</span>);
	}
}

module.exports = { EtherBalance };
