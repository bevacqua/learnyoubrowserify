'use strict';

var fs = require('fs');
var path = require('path');
var test = require('tape');
var spawn = require('child_process').spawn;
var browserify = require('browserify');
var ignored = /^!/;
var names = require('../menu.json').filter(unignored);
var args = process.argv.slice(2);
if (args.length) {
  names = args;
}

var solutions = names.map(expand);
var customBuild = {
};

var customRun = {
};


test(plan);

function expand (name) {
  return path.join(__dirname, '../solutions', name.toLowerCase().replace(/\W+/g, '_'));
}

function unignored (name) {
  return !ignored.test(name);
}

function plan (t) {
  t.plan(names.length * 2);

  (function next () {
    if (names.length === 0) {
      return;
    }
    var name = names.shift();
    var solution = solutions.shift();
    var main = path.join(solution, 'main.js');

    cmd(['select', name]).on('exit', assertion);

    function assertion (code) {
      t.equal(code, 0, 'select ' + name);

      var ps = cmd('verify');
      var b;

      ps.stderr.pipe(process.stderr);
      ps.stdout.pipe(process.stderr);
      ps.on('exit', exited);

      if (customBuild[name]) {
        b = customBuild[name](solution);
      } else {
        b = browserify(main).bundle();
      }
      b.pipe(ps.stdin);

      if (customRun[name]) {
        customRun[name](t);
      }
    }

    function exited (code) {
      t.equal(code, 0, 'verify ' + name);
      next();
    }
  })();
}

function cmd (args) {
  var script = path.join(__dirname, '../bin/learnyoubrowserify');
  return spawn(process.execPath, [script].concat(args));
}
