'use strict'

var shimmer = require('shimmer');
var semver = require('semver')

module.exports = function (express, agent, version) {
  console.log('@stackify [modules/express]')

  // express 5 moves the router methods onto a prototype
  var routerProto = semver.satisfies(version, '^5')
    ? (express.Router && express.Router.prototype)
    : express.Router

  // console.debug('routerProto:')
  // console.log(express.Router)
  shimmer.wrap(express, 'hello', function (orig) {
    console.log('shim express hello')
    return function (req, res, next) {
      console.log('shim express init\n')
      return orig.apply(this, arguments)
    }
  })

  shimmer.wrap(express.Router, 'use', function (orig) {
    console.log('shim express use')
    return function(fn) {
      if (typeof fn === 'string' && Array.isArray(this.stack)) {
        var result = orig.apply(this, arguments)
        
        // console.log('shim express result:',result)
      } else {
        return orig.apply(this, arguments)
      }
    }
  })

  return express
}
