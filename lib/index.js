'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _ws = require('ws');

var _ws2 = _interopRequireDefault(_ws);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _arbiterUtil = require('arbiter-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ArbiterExchangeBitGrail = function (_EventEmitter) {
	_inherits(ArbiterExchangeBitGrail, _EventEmitter);

	function ArbiterExchangeBitGrail() {
		var wsUrl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'wss://ws.bitgrail.com';
		var restUrl = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

		_classCallCheck(this, ArbiterExchangeBitGrail);

		var _this = _possibleConstructorReturn(this, (ArbiterExchangeBitGrail.__proto__ || Object.getPrototypeOf(ArbiterExchangeBitGrail)).call(this));

		_this.restUrl = restUrl;

		var wsClient = _this.wsClient = new _ws2.default(wsUrl, {
			perMessageDeflate: false
		});

		// Handle message and ping the appropriate
		// litener from the container
		wsClient.on('message', function (resp) {
			var respJSON = JSON.parse(resp);

			_this.emit('other', respJSON);
		});

		wsClient.on('open', function () {
			return _this.emit('open');
		});
		wsClient.on('disconnect', function () {
			return _this.emit('close');
		});
		wsClient.on('error', function (error) {
			return _this.emit('error', {
				error: error
			});
		});

		return _this;
	}

	/* Waiting Coroutine */


	_createClass(ArbiterExchangeBitGrail, [{
		key: 'waitFor',
		value: function () {
			var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(eventName) {
				var self;
				return regeneratorRuntime.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								self = this;
								return _context.abrupt('return', new Promise(function (resolve, reject) {
									self.once(eventName, resolve);
								}));

							case 2:
							case 'end':
								return _context.stop();
						}
					}
				}, _callee, this);
			}));

			function waitFor(_x3) {
				return _ref.apply(this, arguments);
			}

			return waitFor;
		}()
	}, {
		key: 'waitForTransaction',
		value: function () {
			var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(id) {
				var pingOffset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4500;
				return regeneratorRuntime.wrap(function _callee2$(_context2) {
					while (1) {
						switch (_context2.prev = _context2.next) {
							case 0:
							case 'end':
								return _context2.stop();
						}
					}
				}, _callee2, this);
			}));

			function waitForTransaction(_x5) {
				return _ref2.apply(this, arguments);
			}

			return waitForTransaction;
		}()
	}, {
		key: 'open',
		value: function () {
			var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
				return regeneratorRuntime.wrap(function _callee3$(_context3) {
					while (1) {
						switch (_context3.prev = _context3.next) {
							case 0:
								return _context3.abrupt('return', this.waitFor('open'));

							case 1:
							case 'end':
								return _context3.stop();
						}
					}
				}, _callee3, this);
			}));

			function open() {
				return _ref3.apply(this, arguments);
			}

			return open;
		}()
	}, {
		key: 'close',
		value: function () {
			var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
				return regeneratorRuntime.wrap(function _callee4$(_context4) {
					while (1) {
						switch (_context4.prev = _context4.next) {
							case 0:
								this.wsClient.close();
								return _context4.abrupt('return', this.waitFor('close'));

							case 2:
							case 'end':
								return _context4.stop();
						}
					}
				}, _callee4, this);
			}));

			function close() {
				return _ref4.apply(this, arguments);
			}

			return close;
		}()
	}, {
		key: 'send',
		value: function send(socketMessage) {
			if (!socketMessage) return;
			this.wsClient.send(JSON.stringify(socketMessage));
		}
	}, {
		key: 'rest',
		value: function () {
			var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(method, route, data) {
				return regeneratorRuntime.wrap(function _callee5$(_context5) {
					while (1) {
						switch (_context5.prev = _context5.next) {
							case 0:
							case 'end':
								return _context5.stop();
						}
					}
				}, _callee5, this);
			}));

			function rest(_x6, _x7, _x8) {
				return _ref5.apply(this, arguments);
			}

			return rest;
		}()
	}, {
		key: 'get',
		value: function () {
			var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(route) {
				return regeneratorRuntime.wrap(function _callee6$(_context6) {
					while (1) {
						switch (_context6.prev = _context6.next) {
							case 0:
								return _context6.abrupt('return', this.rest('GET', route));

							case 1:
							case 'end':
								return _context6.stop();
						}
					}
				}, _callee6, this);
			}));

			function get(_x9) {
				return _ref6.apply(this, arguments);
			}

			return get;
		}()
	}, {
		key: 'post',
		value: function () {
			var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(route, body) {
				return regeneratorRuntime.wrap(function _callee7$(_context7) {
					while (1) {
						switch (_context7.prev = _context7.next) {
							case 0:
								return _context7.abrupt('return', this.rest('POST', route, body));

							case 1:
							case 'end':
								return _context7.stop();
						}
					}
				}, _callee7, this);
			}));

			function post(_x10, _x11) {
				return _ref7.apply(this, arguments);
			}

			return post;
		}()

		/* Streaming APIs: */

	}, {
		key: 'subscribeToReports',
		value: function subscribeToReports() {
			this.send({
				method: 'subscribeReports',
				params: {}
			});
		}
	}, {
		key: 'subscribeToTicker',
		value: function subscribeToTicker() {
			var pair = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ['ETH', 'BTC'];

			this.emit('room', 'trading-' + pair.join('/'));
		}

		/* REST APIs: */

	}, {
		key: 'requestDepositAddress',
		value: function () {
			var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
				var currency = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'ETH';
				var data;
				return regeneratorRuntime.wrap(function _callee8$(_context8) {
					while (1) {
						switch (_context8.prev = _context8.next) {
							case 0:
								_context8.next = 2;
								return this.get('account/crypto/address/' + currency);

							case 2:
								data = _context8.sent;
								return _context8.abrupt('return', data ? data.address : null);

							case 4:
							case 'end':
								return _context8.stop();
						}
					}
				}, _callee8, this);
			}));

			function requestDepositAddress() {
				return _ref8.apply(this, arguments);
			}

			return requestDepositAddress;
		}()
	}, {
		key: 'requestFundTransfer',
		value: function () {
			var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(currency, amount, type) {
				var resp, transaction;
				return regeneratorRuntime.wrap(function _callee9$(_context9) {
					while (1) {
						switch (_context9.prev = _context9.next) {
							case 0:
								_context9.next = 2;
								return this.post('account/transfer', {
									currency: currency,
									amount: amount,
									type: type
								});

							case 2:
								resp = _context9.sent;

								if (resp) {
									_context9.next = 5;
									break;
								}

								return _context9.abrupt('return', null);

							case 5:
								_context9.next = 7;
								return this.waitForTransaction(resp.id);

							case 7:
								transaction = _context9.sent;

								if (!(transaction.status === 'failed')) {
									_context9.next = 10;
									break;
								}

								return _context9.abrupt('return', null);

							case 10:
								return _context9.abrupt('return', transaction);

							case 11:
							case 'end':
								return _context9.stop();
						}
					}
				}, _callee9, this);
			}));

			function requestFundTransfer(_x14, _x15, _x16) {
				return _ref9.apply(this, arguments);
			}

			return requestFundTransfer;
		}()
	}, {
		key: 'requestWithdrawCrypto',
		value: function () {
			var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(_ref10) {
				var _ref10$currency = _ref10.currency,
				    currency = _ref10$currency === undefined ? 'ETH' : _ref10$currency,
				    _ref10$amount = _ref10.amount,
				    amount = _ref10$amount === undefined ? 0.02 : _ref10$amount,
				    _ref10$address = _ref10.address,
				    address = _ref10$address === undefined ? '0x74D5bCAF1ec7CF4BFAF4bb67D51D00dD821c5bF6' : _ref10$address,
				    _ref10$serious = _ref10.serious,
				    serious = _ref10$serious === undefined ? false : _ref10$serious;
				var fundBankTx;
				return regeneratorRuntime.wrap(function _callee10$(_context10) {
					while (1) {
						switch (_context10.prev = _context10.next) {
							case 0:
								_context10.next = 2;
								return this.requestFundTransfer(currency, amount, 'exchangeToBank');

							case 2:
								fundBankTx = _context10.sent;

								if (!(!fundBankTx || !serious)) {
									_context10.next = 5;
									break;
								}

								return _context10.abrupt('return', null);

							case 5:
								return _context10.abrupt('return', this.post('account/crypto/withdraw', {
									currency: currency,
									amount: amount,
									address: address
								}));

							case 6:
							case 'end':
								return _context10.stop();
						}
					}
				}, _callee10, this);
			}));

			function requestWithdrawCrypto(_x17) {
				return _ref11.apply(this, arguments);
			}

			return requestWithdrawCrypto;
		}()
	}, {
		key: 'requestFundToExchange',
		value: function () {
			var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(currency, quantity) {
				return regeneratorRuntime.wrap(function _callee11$(_context11) {
					while (1) {
						switch (_context11.prev = _context11.next) {
							case 0:
								return _context11.abrupt('return', this.requestFundTransfer(currency, quantity, 'bankToExchange'));

							case 1:
							case 'end':
								return _context11.stop();
						}
					}
				}, _callee11, this);
			}));

			function requestFundToExchange(_x18, _x19) {
				return _ref12.apply(this, arguments);
			}

			return requestFundToExchange;
		}()
	}, {
		key: 'requestBuyOrder',
		value: function () {
			var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(_ref13) {
				var _ref13$pair = _ref13.pair,
				    pair = _ref13$pair === undefined ? ['EOS', 'ETH'] : _ref13$pair,
				    _ref13$quantity = _ref13.quantity,
				    quantity = _ref13$quantity === undefined ? 0.01 : _ref13$quantity,
				    _ref13$price = _ref13.price,
				    price = _ref13$price === undefined ? 0 : _ref13$price;
				var symbol, params, data, fundExchangeTx;
				return regeneratorRuntime.wrap(function _callee12$(_context12) {
					while (1) {
						switch (_context12.prev = _context12.next) {
							case 0:
								symbol = pair.join('');
								_context12.next = 3;
								return this.makeOrderParams('buy', symbol, quantity, price);

							case 3:
								params = _context12.sent;


								this.send({
									id: 'buy',
									method: 'newOrder',
									params: params
								});

								_context12.next = 7;
								return Promise.race([this.waitFor('order'), this.waitFor('error')]);

							case 7:
								data = _context12.sent;

								if (!(data.error && data.error.code === 20001)) {
									_context12.next = 17;
									break;
								}

								_context12.next = 11;
								return this.requestFundToExchange(pair[1], quantity);

							case 11:
								fundExchangeTx = _context12.sent;

								if (fundExchangeTx) {
									_context12.next = 16;
									break;
								}

								return _context12.abrupt('return', null);

							case 16:
								return _context12.abrupt('return', this.requestBuyOrder(pair, quantity, price));

							case 17:
								return _context12.abrupt('return', data);

							case 18:
							case 'end':
								return _context12.stop();
						}
					}
				}, _callee12, this);
			}));

			function requestBuyOrder(_x20) {
				return _ref14.apply(this, arguments);
			}

			return requestBuyOrder;
		}()
	}, {
		key: 'requestSellOrder',
		value: function () {
			var _ref16 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(_ref15) {
				var _ref15$pair = _ref15.pair,
				    pair = _ref15$pair === undefined ? ['EOS', 'ETH'] : _ref15$pair,
				    _ref15$quantity = _ref15.quantity,
				    quantity = _ref15$quantity === undefined ? 0.01 : _ref15$quantity,
				    _ref15$price = _ref15.price,
				    price = _ref15$price === undefined ? 0 : _ref15$price;
				var symbol, params, data, fundExchangeTx;
				return regeneratorRuntime.wrap(function _callee13$(_context13) {
					while (1) {
						switch (_context13.prev = _context13.next) {
							case 0:
								symbol = pair.join('');
								_context13.next = 3;
								return this.makeOrderParams('sell', symbol, quantity, price);

							case 3:
								params = _context13.sent;


								this.send({
									id: 'sell',
									method: 'newOrder',
									params: params
								});

								_context13.next = 7;
								return Promise.race([this.waitFor('order'), this.waitFor('error')]);

							case 7:
								data = _context13.sent;

								if (!(data.error && data.error.code === 20001)) {
									_context13.next = 17;
									break;
								}

								_context13.next = 11;
								return this.requestFundToExchange(pair[0], quantity);

							case 11:
								fundExchangeTx = _context13.sent;

								if (fundExchangeTx) {
									_context13.next = 16;
									break;
								}

								return _context13.abrupt('return', null);

							case 16:
								return _context13.abrupt('return', this.requestSellOrder(pair, quantity, price));

							case 17:
								return _context13.abrupt('return', data);

							case 18:
							case 'end':
								return _context13.stop();
						}
					}
				}, _callee13, this);
			}));

			function requestSellOrder(_x21) {
				return _ref16.apply(this, arguments);
			}

			return requestSellOrder;
		}()
	}, {
		key: 'requestCancelOrder',
		value: function requestCancelOrder(clientOrderId) {
			this.send({
				id: 'cancel',
				method: 'cancelOrder',
				params: {
					clientOrderId: clientOrderId
				}
			});

			return this.waitFor('order');
		}
	}, {
		key: 'requestTradingBalance',
		value: function requestTradingBalance() {
			this.send({
				id: 'balance',
				method: 'getTradingBalance',
				params: {}
			});
		}
	}, {
		key: 'authenticate',
		value: function () {
			var _ref18 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(_ref17) {
				var key = _ref17.key,
				    secret = _ref17.secret;
				var basicAuthKey, id, method, algo, nonce, signature;
				return regeneratorRuntime.wrap(function _callee14$(_context14) {
					while (1) {
						switch (_context14.prev = _context14.next) {
							case 0:
								basicAuthKey = new Buffer(key + ':' + secret).toString('base64');


								this.restHeaders = {
									'Accept': 'application/json',
									'Content-Type': 'application/json',
									'Connection': 'Keep-Alive',
									'Authorization': 'Basic ' + basicAuthKey
								};

								id = 'auth';
								method = 'login';
								algo = 'HS256';

								// Authentication using sha256 is something boggling :O

								nonce = Date.now() + Math.random().toString();
								signature = _crypto2.default.createHmac('sha256', secret).update(nonce).digest('hex');


								this.send({
									id: id,
									method: method,
									params: {
										algo: algo,
										pKey: key,
										nonce: nonce,
										signature: signature
									}
								});

								return _context14.abrupt('return', this.waitFor('auth'));

							case 9:
							case 'end':
								return _context14.stop();
						}
					}
				}, _callee14, this);
			}));

			function authenticate(_x22) {
				return _ref18.apply(this, arguments);
			}

			return authenticate;
		}()
	}, {
		key: 'makeOrderParams',
		value: function () {
			var _ref19 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15(side, symbol, quantity, price) {
				var clientOrderId, params;
				return regeneratorRuntime.wrap(function _callee15$(_context15) {
					while (1) {
						switch (_context15.prev = _context15.next) {
							case 0:
								_context15.next = 2;
								return (0, _arbiterUtil.generateRandomBytesHex)();

							case 2:
								clientOrderId = _context15.sent;
								params = {
									side: side,
									symbol: symbol,
									quantity: quantity,
									clientOrderId: clientOrderId
								};


								if (!price) {
									params.type = 'market';
									params.timeInForce = 'IOC';
								} else {
									params.price = price;
								}

								return _context15.abrupt('return', params);

							case 6:
							case 'end':
								return _context15.stop();
						}
					}
				}, _callee15, this);
			}));

			function makeOrderParams(_x23, _x24, _x25, _x26) {
				return _ref19.apply(this, arguments);
			}

			return makeOrderParams;
		}()
	}]);

	return ArbiterExchangeBitGrail;
}(_events2.default);

exports.default = ArbiterExchangeBitGrail;