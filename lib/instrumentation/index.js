'use strict'

var fs = require('fs')
var path = require('path')
var Hook = require('require-in-the-middle')

var MODULES = ['http', 'express']

module.exports = Instrumentation

function Instrumentation (agent) {
  console.log('@stackify instrumentation agent:', JSON.stringify(agent))
  console.log('@stackify instrumentation agent:', agent)
  this._agent = agent
  this._queue = null
  this._started = false
  this.currentTransaction = null
}

Instrumentation.prototype.start = function () {
  console.log('@stackify [instrumentation start()]')
  var self = this

  //Use a third party module that hooks
  Hook(MODULES, function (exports, name, basedir) {
    var pkg, version
    console.log('\n',basedir)
    if (basedir) {
      pkg = path.join(basedir, 'package.json')
      try {
        version = JSON.parse(fs.readFileSync(pkg)).version
        console.log(name)
      } catch (e) {
        console.log('could not shim %s module: %s', name, e.message)
        return exports
      }
    } else {
      version = process.versions.node
    }

    // self._agent.logger.debug('shimming %s@%s module', name, version)
    // return require('./modules/' + name)(exports, self._agent, version)
    return require('../modules/' + name)(exports)
    // return exports
  })

}
