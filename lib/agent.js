'use strict'

var fs = require('fs')
var path = require('path')
var Hook = require('require-in-the-middle')
var Instrumentation = require('./instrumentation')

var MODULES = ['http', 'express', 'cookie-parser', 'lodash']

module.exports = Agent

function Agent() {
  console.log('@stackify [lib/agent]')
  var self = this

  this._instrumentation = new Instrumentation(this)

}

Agent.prototype.start = function (opts) {
  this._instrumentation.start()
}
