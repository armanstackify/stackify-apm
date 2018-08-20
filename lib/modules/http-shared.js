'use strict'

var url = require('url')
var endOfStream = require('end-of-stream')
var fs = require('fs')
var JSON = require('circular-json')

exports.instrumentRequest = function (agent, moduleName) {
  return function (orig) {
    return function (event, req, res) {
      console.log('@stackify [modules/http-shared] e:',event)
      if (event === 'request') {
        fs.appendFileSync(require('path').join(process.cwd()) + '/httpshared.log', JSON.stringify(req))

        endOfStream(res, function (err) {
          res.on('prefinish', function () {
            fs.appendFileSync(require('path').join(process.cwd()) + '/httpshared.log', JSON.stringify({'currentPosition': 'prefinish'}))
            // trans.end()
          })
        })

      }

      return orig.apply(this, arguments)
    }
  }
}

exports.traceOutgoingRequest = function (agent, moduleName) {
  console.log('@stackify [modules/http-shared] traceOutgoingRequest 1')
  return function (orig) {
    return function () {
      console.log('@stackify [modules/http-shared] traceOutgoingRequest 2')
      var req = orig.apply(this, arguments)
      fs.appendFileSync(require('path').join(process.cwd()) + '/httpshared.log', JSON.stringify({currentPosition: 'start'}))
      console.log('traceOutgoingRequest');

      req.on('response', onresponse)
      return req

      function onresponse (res) {
        var existing = res._events && res._events.end
        if (!existing) {
          res.on('end', onEnd)
        } else {
          if (typeof existing === 'function') {
            res._events.end = [onEnd, existing]
          } else {
            existing.unshift(onEnd)
          }
        }
        
        function onEnd () {
          console.log('intercepted http.IncomingMessage end event %o', {id: id})
          // span.end()
        }
      }
    }
  }
}
