
const React = require('react');
const { Rspan, ReactiveComponent, Hash } = require('oo7-react');
const { bonds, formatBlockNumber } = require('oo7-parity');
const { InlineAccount } = require('./');
const { Card, List, Icon } = require('semantic-ui-react');

// Reactive Block view
// properties: author/miner[default], minerRegistry,  difficulty, totalDifficulty , gasLimit, gasUsed, hash, parentHash, sh3Uncles, size, transactions, timestamp[default], blockNumber[default], extraData
// not included: stateRoot, receiptsRoot (txns), step, transactionsRoot, uncles, logsBloom, sealFields, signature
// planned to include: [nonce, blockReward, unclesReward]

const digits = 6;
const formatDifficulty = d => d.toString(10).substring(0, digits - 1) + 'e^' + (d.toString(10).length - (digits - 1));

class Block extends ReactiveComponent {
	constructor () {
		super(['block']);
	}
	render () {
		if (!this.state.block) {
			return (
				<Card fluid>
					<Card.Content>
						<Card.Description>
							<Icon name='warning circle' style={ { height: '100%' } } />
              block undefined
						</Card.Description>
					</Card.Content>
				</Card>
			);
		} else {
			return (
				<Card fluid>
					<Card.Content>
						<Card.Description>
							<List divided verticalAlign='middle'>
								{this.props.blockNumber ? <List.Item>
									<List.Content>
                        BlockNumber
									</List.Content>
									<List.Content floated='right'>
										<Rspan>{formatBlockNumber(this.state.block.number)}</Rspan>
									</List.Content>
								</List.Item> : '' }
								{this.props.timestamp ? <List.Item>
									<List.Content>
                        TimeStamp
									</List.Content>
									<List.Content floated='right'>
										<div style={ { fontSize: 'x-small' } }>{this.state.block.timestamp.toString()}</div>
									</List.Content>
								</List.Item> : '' }
								{this.props.transactions ? <List.Item>
									<List.Content>
                        Transactions
									</List.Content>
									<List.Content floated='right'>
										<Rspan>{this.state.block.transactions.length}</Rspan> txns
									</List.Content>
								</List.Item> : '' }
								{this.props.hash ? <List.Item>
									<List.Content>
                        Hash
									</List.Content>
									<List.Content floated='right'>
										<Hash value={ this.state.block.hash } />
									</List.Content>
								</List.Item> : '' }
								{this.props.parentHash ? <List.Item>
									<List.Content>
                        ParentHash
									</List.Content>
									<List.Content floated='right'>
										<Hash value={ this.state.block.parentHash } />
									</List.Content>
								</List.Item> : '' }
								{this.props.sha3Uncles ? <List.Item>
									<List.Content>
                        Sha3Uncles
									</List.Content>
									<List.Content floated='right'>
										<Hash value={ this.state.block.sha3Uncles } />
									</List.Content>
								</List.Item> : '' }
								{(this.props.author || this.props.miner) ? <List.Item>
									<List.Content floated='right'>
										<InlineAccount address={ this.state.block.author } />
									</List.Content>
									<List.Content>
                        Mined by
									</List.Content>
								</List.Item> : '' }
								{this.props.minerRegistry ? <List.Item>
									<List.Content floated='right'>
										<Rspan>{bonds.registry.canReverse(this.state.block.author).map(b => b ? bonds.registry.reverse(this.state.block.author) : 'NaN')}</Rspan>
									</List.Content>
									<List.Content>
                        Miners Registry
									</List.Content>
								</List.Item> : '' }
								{this.props.difficulty ? <List.Item>
									<List.Content>
                        Difficulty
									</List.Content>
									<List.Content floated='right'>
										<Rspan>{formatDifficulty(this.state.block.difficulty)}</Rspan>
									</List.Content>
								</List.Item> : '' }
								{this.props.totalDifficulty ? <List.Item>
									<List.Content>
                        Total Difficulty
									</List.Content>
									<List.Content floated='right'>
										<Rspan>{formatDifficulty(this.state.block.totalDifficulty)}</Rspan>
									</List.Content>
								</List.Item> : '' }
								{this.props.size ? <List.Item>
									<List.Content>
                        Size
									</List.Content>
									<List.Content floated='right'>
										<Rspan>{this.state.block.size.toString(10)}</Rspan>
									</List.Content>
								</List.Item> : '' }
								{this.props.gasLimit ? <List.Item>
									<List.Content>
                        Gas Limit
									</List.Content>
									<List.Content floated='right'>
										<Rspan style={ { fontSize: 'small' } }>{this.state.block.gasLimit.toString(10)}</Rspan>
									</List.Content>
								</List.Item> : '' }
								{this.props.gasUsed ? <List.Item>
									<List.Content>
                        Gas Used
									</List.Content>
									<List.Content floated='right'>
										<Rspan style={ { fontSize: 'small' } }>{this.state.block.gasUsed.toString(10)}</Rspan>
									</List.Content>
								</List.Item> : '' }
								{/* TODO: BlockReward, UncleReward, Nonce */}
								{this.props.extraData ? <List.Item>
									<List.Content>
                        Extra Data
									</List.Content>
									<List.Content floated='right'>
										<Hash value={ this.state.block.extraData.toString(16) } />
									</List.Content>
								</List.Item> : '' }
							</List>
						</Card.Description>
					</Card.Content>
				</Card>
			);
		}
	}
}

Block.defaultProps = {
	author: true,
	blockNumber: true,
	timestamp: true
};

module.exports = { Block };
