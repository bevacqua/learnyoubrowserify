'use strict';

var fs = require('fs');
var path = require('path');
var contra = require('contra');
var verify = require('adventure-verify');
var unpack = require('browser-unpack');
var concat = require('concat-stream');
var api = module.exports;

api.problem = fs.createReadStream(__dirname + '/problem.txt');
api.solution = fs.createReadStream(__dirname + '/solution.txt');

api.verify = verify({ modeReset: true }, function (args, t) {
  t.plan(4);
  console.log(args);
});

api.run = function (args) {
  var file = path.resolve(args[0]);
  var pkg = require(path.dirname(file) + '/package.json');
  var store = require(file);
  var main = Object.keys(pkg.browser)[0];

  node(Function.prototype);

  function node (done) {
    contra.waterfall([
      function (next) {
        store.save('awesome!', {car:'audi'}, next);
      },
      function (next) {
        store.get('awesome!', next);
      },
      function (data, next) {
        console.log(data);
        store.remove('awesome!', next);
      },
      function (next) {
        store.get('awesome!', function (err, data) {
          if (err) {
            next(err); return;
          }
          if (data) {
            next(new Error('data was not deleted!')); return;
          }
          next();
        });
      }
    ], function (err) {
      if (err) {
        throw err;
      }
      done();
    });
  }
};
