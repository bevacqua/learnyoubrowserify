'use strict';

var fs = require('fs');
var vm = require('vm');
var path = require('path');
var verify = require('adventure-verify');
var unpack = require('browser-unpack');
var concat = require('concat-stream');
var glob = require('glob');
var api = module.exports;
var fixtures = [{file:'<null>',text:null}].concat(glob.sync('problems/exporter_importer/fixture/*.txt').map(read));
var expectation = {
  '<null>': 'That should take you approximately a few seconds to read',
  'romeo-juliet': 'That should take you approximately an hour to read',
  'quick-fox': 'That should take you approximately a few seconds to read',
  'moby-dick': 'That should take you approximately 12 hours to read',
  'hamlet-part': 'That should take you approximately 4 minutes to read'
};

function read (file) {
  return {
    text: fs.readFileSync(file), file: path.basename(file, '.txt')
  };
}

api.problem = fs.createReadStream(__dirname + '/problem.txt');
api.solution = fs.createReadStream(__dirname + '/solution.txt');

api.verify = verify({ modeReset: true }, function (args, t) {
  t.plan(fixtures.length + 1);
  process.stdin.pipe(concat(function (body) {
    var rows;
    try {
      rows = unpack(body);
    } catch (err) {
      return t.fail('The input had a syntax error!');
    }
    if (!rows) {
      return t.fail('The input is not a browserify bundle!');
    }

    t.deepEqual(rows[0].deps, {}, 'shouldn\'t have any deps');

    run(body.toString(), function (approximate) {
      return function (fixture) {
        t.equal(approximate(fixture.text), expectation[fixture.file], fixture.file + '? ' + expectation[fixture.file]);
      };
    });
  }));
});

api.run = function (args) {
  process.stdin.pipe(concat(function (body) {
    run(body.toString(), function (approximate) {
      return function (fixture) {
        console.log(approximate(fixture.text));
      };
    });
  }));
};

function run (body, cb) {
  var glob = {};
  vm.runInNewContext(body, glob, 'browserify-vm');
  var approximate = glob.require('approximate');
  fixtures.forEach(cb(approximate));
}
