var estimate = require('estimate');
var moment = require('moment');

function approximate (data) {
  var seconds = estimate.text(String(data));
  var human = moment.duration(seconds, 'seconds').humanize();
  return 'That should take you approximately ' + human + ' to read';
}

module.exports = approximate;
