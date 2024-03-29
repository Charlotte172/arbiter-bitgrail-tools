import EventEmitter from 'events';

import WebSocket from 'ws';

import crypto from 'crypto';

import fetch from 'node-fetch';

import {
	wait,
	generateRandomBytesHex
} from 'arbiter-util';

export default class ArbiterExchangeBitGrail extends EventEmitter {

	constructor(wsUrl = 'wss://ws.bitgrail.com', restUrl = '') {
		super()

		this.restUrl = restUrl;

		const wsClient = this.wsClient = new WebSocket(wsUrl, {
			perMessageDeflate: false
		});

		// Handle message and ping the appropriate
		// litener from the container
		wsClient.on('message', (resp) => {
			const respJSON = JSON.parse(resp);



			this.emit('other', respJSON)
		})

		wsClient.on('open', () => this.emit('open'))
		wsClient.on('disconnect', () => this.emit('close'))
		wsClient.on('error', (error) => this.emit('error', {
			error
		}))

	}

	/* Waiting Coroutine */
	async waitFor(eventName) {
		const self = this;
		return new Promise(function (resolve, reject) {
			self.once(eventName, resolve)
		});
	}

	async waitForTransaction(id, pingOffset = 4500) {

	}

	async open() {
		return this.waitFor('open')
	}

	async close() {
		this.wsClient.close()
		return this.waitFor('close')
	}

	send(socketMessage) {
		if(!socketMessage) return;
		this.wsClient.send(JSON.stringify(socketMessage))
	}

	async rest(method, route, data) {

	}

	async get(route) {
		return this.rest('GET', route)
	}

	async post(route, body) {
		return this.rest('POST', route, body)
	}

	/* Streaming APIs: */
	subscribeToReports() {
		this.send({
			method: 'subscribeReports',
			params: {}
		})
	}

	subscribeToTicker(pair = ['ETH', 'BTC']) {
		this.emit('room', `trading-${pair.join('/')}`)
	}

	/* REST APIs: */

	async requestDepositAddress(currency = 'ETH') {
		const data = await this.get(`account/crypto/address/${currency}`)

		return data ? data.address : null;
	}

	async requestFundTransfer(currency, amount, type) {
		const resp = await this.post(`account/transfer`, {
			currency,
			amount,
			type
		})

		if(!resp) {
			return null
		}

		const transaction = await this.waitForTransaction(resp.id)

		if(transaction.status === 'failed') {
			return null
		}

		return transaction
	}

	async requestWithdrawCrypto({
		currency = 'ETH',
		amount = 0.02,
		address = '0x74D5bCAF1ec7CF4BFAF4bb67D51D00dD821c5bF6',
		serious = false
	}) {

		// Transfer the required fund from exchange to main wallet
		const fundBankTx = await this.requestFundTransfer(currency, amount, 'exchangeToBank')

		if(!fundBankTx || !serious) {
			return null
		}

		// Send from main wallet to the designated
		return this.post(`account/crypto/withdraw`, {
			currency,
			amount,
			address
		})
	}

	async requestFundToExchange(currency, quantity) {
		// Transfer the required fund from exchange to main wallet
		return this.requestFundTransfer(currency, quantity, 'bankToExchange')
	}

	async requestBuyOrder({
		pair = ['EOS', 'ETH'],
		quantity = 0.01,
		price = 0
	}) {
		const symbol = pair.join('')

		const params = await this.makeOrderParams('buy', symbol, quantity, price, )

		this.send({
			id: 'buy',
			method: 'newOrder',
			params
		})

		const data = await Promise.race([
			this.waitFor('order'),
			this.waitFor('error')
		])

		if(data.error && data.error.code === 20001) {
			// Insufficient fund:
			const fundExchangeTx = await this.requestFundToExchange(pair[1], quantity)

			if(!fundExchangeTx) {
				return null;
			} else {
				return this.requestBuyOrder(pair, quantity, price)
			}
		}

		return data;
	}

	async requestSellOrder({
		pair = ['EOS', 'ETH'],
		quantity = 0.01,
		price = 0
	}) {
		const symbol = pair.join('')

		const params = await this.makeOrderParams('sell', symbol, quantity, price, )

		this.send({
			id: 'sell',
			method: 'newOrder',
			params
		})

		const data = await Promise.race([
			this.waitFor('order'),
			this.waitFor('error')
		])

		if(data.error && data.error.code === 20001) {
			// Insufficient fund:
			const fundExchangeTx = await this.requestFundToExchange(pair[0], quantity)

			if(!fundExchangeTx) {
				return null;
			} else {
				return this.requestSellOrder(pair, quantity, price)
			}
		}

		return data;
	}

	requestCancelOrder(clientOrderId) {
		this.send({
			id: 'cancel',
			method: 'cancelOrder',
			params: {
				clientOrderId
			}
		})

		return this.waitFor('order')
	}

	requestTradingBalance() {
		this.send({
			id: 'balance',
			method: 'getTradingBalance',
			params: {}
		})
	}

	async authenticate({
		key,
		secret
	}) {

		const basicAuthKey = new Buffer(`${key}:${secret}`)
			.toString('base64')

		this.restHeaders = {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Connection': 'Keep-Alive',
			'Authorization': `Basic ${basicAuthKey}`
		}

		const id = 'auth';
		const method = 'login';
		const algo = 'HS256';

		// Authentication using sha256 is something boggling :O
		const nonce = Date.now() + Math.random()
			.toString()

		const signature = crypto.createHmac('sha256', secret)
			.update(nonce)
			.digest('hex');

		this.send({
			id,
			method,
			params: {
				algo,
				pKey: key,
				nonce,
				signature,
			},
		})

		return this.waitFor('auth')
	}

	async makeOrderParams(side, symbol, quantity, price) {
		const clientOrderId = await generateRandomBytesHex()

		const params = {
			side,
			symbol,
			quantity,
			clientOrderId,
		}

		if(!price) {
			params.type = 'market'
			params.timeInForce = 'IOC'
		} else {
			params.price = price
		}

		return params;
	}
}