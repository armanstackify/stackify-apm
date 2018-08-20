'use strict'
var httpShared = require('./http-shared')
var shimmer = require('shimmer');
var semver = require('semver')

module.exports = function(http, agent) {
  shimmer.wrap(http && http.Server && http.Server.prototype, 'emit', httpShared.instrumentRequest(agent, 'http'))
  shimmer.wrap(http, 'request', httpShared.traceOutgoingRequest(agent, 'http'))
  // shimmer.wrap(http, 'request', function (original) {
  //   return function () {
  //     console.log("Starting http request!");
  //     var returned = original.apply(this, arguments)
  //     console.log("Done setting up request -- OH YEAH!");
  //     return returned;
  //   };
  // });

  return http
}
